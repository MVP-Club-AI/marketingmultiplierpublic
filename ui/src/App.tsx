import { useState, useEffect, useCallback } from 'react'
import { Session, SessionsData, ServerMessage, ChatRequest } from './lib/types'
import { PermissionRequest } from './lib/sdkTypes'
import { ChatMessages } from './components/chat/ChatMessages'
import { InputBar } from './components/chat/InputBar'
import { PipelineView } from './components/pipeline/PipelineView'
import { NewsletterView } from './components/newsletter/NewsletterView'
import { PermissionDialog } from './components/chat/PermissionDialog'
import { useChatState } from './hooks/useChatState'
import { useClaudeStreaming } from './hooks/useClaudeStreaming'
import { WebSocketContext } from './contexts/WebSocketContext'
import { CalendarView } from './components/calendar/CalendarView'
import { ActivityFeed } from './components/activity/ActivityFeed'

type Tab = 'chat' | 'pipeline' | 'calendar' | 'newsletter'

const COMMAND_GROUPS = [
  {
    label: 'Content Creation',
    commands: [
      { name: '/generate-weekly-content', label: 'Weekly Content', description: 'Generate a full week of LinkedIn posts for all founders' },
      { name: '/linkedin-post', label: 'LinkedIn Post', description: 'Create a single LinkedIn post from an idea or topic' },
      { name: '/blog-post', label: 'Blog Post', description: 'Write a blog post for the [Your Company] website' },
      { name: '/draft-newsletter', label: 'Draft Newsletter', description: 'Create the weekly newsletter with founder reflections and updates' },
      { name: '/process-idea', label: 'Process Idea', description: 'Turn a rough idea into polished content for multiple channels' },
    ],
  },
  {
    label: 'Repurposing',
    commands: [
      { name: '/process-transcript', label: 'Process Transcript', description: 'Convert a session transcript into content for all channels' },
      { name: '/repurpose-session', label: 'Repurpose Session', description: 'Create a complete content package from a coaching session' },
    ],
  },
  {
    label: 'Pipeline',
    commands: [
      { name: '/approve-content', label: 'Approve Content', description: 'Review and move content from to-review to to-post or posted' },
      { name: '/publish-blog', label: 'Publish Blog', description: 'Push an approved blog post live to the website' },
      { name: '/content-review', label: 'Content Review', description: 'Get a summary of all content awaiting review' },
    ],
  },
  {
    label: 'Campaigns',
    commands: [
      { name: '/campaign-brief', label: 'Campaign Brief', description: 'Create a new marketing campaign from a brief' },
      { name: '/dm-outreach', label: 'DM Outreach', description: 'Generate personalized DM templates for outreach' },
    ],
  },
  {
    label: 'Analytics',
    commands: [
      { name: '/log-post', label: 'Log Post', description: 'Record a published post and its performance metrics' },
      { name: '/analyze-week', label: 'Analyze Week', description: 'Review weekly metrics and get improvement recommendations' },
      { name: '/review-project', label: 'Review Project', description: 'Get a status overview of the marketing system' },
    ],
  },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [workingDirectory, setWorkingDirectory] = useState<string>('')
  const [showActivity, setShowActivity] = useState(false)

  // Chat state and streaming hooks
  const {
    messages,
    isLoading,
    claudeSessionId,
    currentRequestId,
    setIsLoading,
    setClaudeSessionId,
    setCurrentRequestId,
    addMessages,
    addUserMessage,
    clearMessages,
    generateRequestId,
  } = useChatState()

  const { sendChatMessage, clearCache } = useClaudeStreaming()

  // Permission handling state
  const [pendingPermission, setPendingPermission] = useState<PermissionRequest | null>(null)
  const [allowedTools, setAllowedTools] = useState<string[]>([])

  // Command prefill state
  const [commandPrefill, setCommandPrefill] = useState<string>('')

  // Fetch config (working directory) from server
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.projectRoot) setWorkingDirectory(data.projectRoot)
      })
      .catch(err => console.error('Failed to load config:', err))
  }, [])

  // Connect to WebSocket for session and file events
  useEffect(() => {
    let socket: WebSocket | null = null
    let retryTimeout: ReturnType<typeof setTimeout> | null = null
    let retryCount = 0
    const maxRetries = 10
    const retryDelay = 1000

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: ServerMessage = JSON.parse(event.data)
        switch (message.type) {
          case 'session-created':
            setActiveSessionId(message.session.id)
            clearMessages()
            clearCache()
            break
          case 'sessions-update':
            setSessions(message.sessions)
            break
          case 'attached':
            clearMessages()
            clearCache()
            break
          case 'error':
            console.error('Server error:', message.message)
            break
        }
      } catch (err) {
        console.error('Failed to parse message:', err)
      }
    }

    const connect = () => {
      if (socket?.readyState === WebSocket.OPEN) return

      socket = new WebSocket('ws://localhost:5001')

      socket.onopen = () => {
        setConnected(true)
        setWs(socket)
        retryCount = 0
        console.log('WebSocket connected')
      }

      socket.onclose = () => {
        setConnected(false)
        setWs(null)
        console.log('WebSocket disconnected')

        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Reconnecting... (attempt ${retryCount})`)
          retryTimeout = setTimeout(connect, retryDelay)
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      socket.onmessage = handleMessage
    }

    connect()

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout)
      if (socket) socket.close()
    }
  }, [clearMessages, clearCache])

  // Load sessions on mount
  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then((data: SessionsData) => {
        setSessions(data.sessions)
        if (data.activeSessionId) {
          setActiveSessionId(data.activeSessionId)
        }
      })
      .catch(err => console.error('Failed to load sessions:', err))
  }, [])

  // Attach to session when active session changes
  useEffect(() => {
    if (ws && connected && activeSessionId) {
      ws.send(JSON.stringify({ type: 'attach', sessionId: activeSessionId }))
    }
  }, [ws, connected, activeSessionId])

  // Auto-create session when connected and no active session
  useEffect(() => {
    if (ws && connected && !activeSessionId && sessions.length === 0) {
      ws.send(JSON.stringify({ type: 'create-session' }))
    }
  }, [ws, connected, activeSessionId, sessions.length])

  const createSession = useCallback((name?: string) => {
    if (ws && connected) {
      ws.send(JSON.stringify({ type: 'create-session', name }))
    }
  }, [ws, connected])

  // Send message via HTTP streaming
  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return

    const requestId = generateRequestId()
    addUserMessage(messageContent)
    setIsLoading(true)

    try {
      const request: ChatRequest = {
        message: messageContent,
        requestId,
        workingDirectory,
        ...(claudeSessionId ? { sessionId: claudeSessionId } : {}),
        ...(allowedTools.length > 0 ? { allowedTools } : {}),
      }

      await sendChatMessage(request, {
        addMessages,
        onSessionId: setClaudeSessionId,
        onError: (error) => {
          addMessages([{
            type: 'error',
            message: error,
            timestamp: Date.now(),
          }])
        },
        onDone: () => {
          setIsLoading(false)
          setCurrentRequestId(null)
        },
        onPermissionRequest: (request) => {
          setPendingPermission(request)
        },
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      addMessages([{
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message',
        timestamp: Date.now(),
      }])
    } finally {
      setIsLoading(false)
      setCurrentRequestId(null)
    }
  }, [
    isLoading,
    workingDirectory,
    claudeSessionId,
    allowedTools,
    generateRequestId,
    addUserMessage,
    addMessages,
    setIsLoading,
    setClaudeSessionId,
    setCurrentRequestId,
    sendChatMessage,
  ])

  // Abort current request
  const handleAbort = useCallback(async () => {
    if (currentRequestId) {
      try {
        await fetch(`/api/abort/${currentRequestId}`, { method: 'POST' })
      } catch (err) {
        console.error('Failed to abort:', err)
      }
      setIsLoading(false)
      setCurrentRequestId(null)
    }
  }, [currentRequestId, setIsLoading, setCurrentRequestId])

  // Prefill a command (from quick commands) - user can add context before sending
  const prefillCommand = useCallback((command: string) => {
    setCommandPrefill(command)
  }, [])

  // Handle permission approval
  const handlePermissionApprove = useCallback((allowAlways: boolean) => {
    if (!pendingPermission) return

    if (allowAlways) {
      // Add tool to allowed list for future requests
      setAllowedTools(prev => {
        const toolPattern = `${pendingPermission.toolName}(*)`
        if (!prev.includes(toolPattern)) {
          return [...prev, toolPattern]
        }
        return prev
      })
    }

    // Clear the pending permission and let Claude retry
    setPendingPermission(null)

    // Send a message to retry the operation
    addMessages([{
      type: 'chat',
      role: 'user',
      content: `[Permission granted for ${pendingPermission.toolName}]`,
      timestamp: Date.now(),
    }])

    // Note: Claude Code SDK handles permission internally
    // The user should respond to the original prompt again
  }, [pendingPermission, addMessages])

  // Handle permission denial
  const handlePermissionDeny = useCallback(() => {
    setPendingPermission(null)
    addMessages([{
      type: 'chat',
      role: 'user',
      content: '[Permission denied]',
      timestamp: Date.now(),
    }])
  }, [addMessages])

  return (
    <WebSocketContext.Provider value={{ ws, connected }}>
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Marketing System</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowActivity(!showActivity)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${
              showActivity
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Activity
          </button>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
          <button
            onClick={() => createSession()}
            className="bg-amber-500 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-amber-600 transition"
          >
            New Session
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-slate-800 px-4">
        <nav className="flex gap-1">
          {(['chat', 'pipeline', 'calendar', 'newsletter'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-slate-50 text-slate-900 rounded-t'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {activeTab === 'chat' && (
          <>
            {/* Left sidebar - Quick Commands */}
            <aside className="w-48 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
              <div className="p-3">
                <h3 className="font-semibold text-xs text-slate-500 mb-3">Commands</h3>
                <div className="space-y-3">
                  {COMMAND_GROUPS.map(group => (
                    <div key={group.label}>
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        {group.label}
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {group.commands.map(cmd => (
                          <div key={cmd.name} className="relative group">
                            <button
                              onClick={() => prefillCommand(cmd.name)}
                              disabled={!activeSessionId || isLoading}
                              className="w-full text-left text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {cmd.label}
                            </button>
                            <div className="fixed left-52 z-[9999] hidden group-hover:block w-56 p-2 bg-slate-800 text-white text-xs rounded shadow-lg pointer-events-none">
                              <div className="font-mono text-amber-400 mb-1">{cmd.name}</div>
                              <div>{cmd.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Chat area */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden p-4 gap-4">
              <ChatMessages messages={messages} isLoading={isLoading} />
              <InputBar
                onSubmit={sendMessage}
                disabled={!connected}
                isLoading={isLoading}
                onAbort={handleAbort}
                prefillValue={commandPrefill}
                onPrefillConsumed={() => setCommandPrefill('')}
              />
            </div>
          </>
        )}

        {activeTab === 'pipeline' && <PipelineView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'newsletter' && <NewsletterView />}

        {/* Activity sidebar */}
        {showActivity && (
          <aside className="w-72 border-l border-navy-100 bg-white overflow-hidden flex flex-col shrink-0">
            <ActivityFeed />
          </aside>
        )}
      </main>

      {/* Permission Dialog */}
      {pendingPermission && (
        <PermissionDialog
          request={pendingPermission}
          onApprove={handlePermissionApprove}
          onDeny={handlePermissionDeny}
        />
      )}
    </div>
    </WebSocketContext.Provider>
  )
}

export default App
