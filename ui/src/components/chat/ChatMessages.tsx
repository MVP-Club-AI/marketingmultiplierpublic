import { useRef, useEffect } from 'react'
import type { AllMessage } from '../../lib/sdkTypes'
import {
  isChatMessage,
  isToolMessage,
  isToolResultMessage,
  isThinkingMessage,
  isTodoMessage,
  isSystemMessage,
  isResultMessage,
  isErrorMessage,
} from '../../lib/sdkTypes'
import { ChatBubble } from './messages/ChatBubble'
import { ToolCard } from './messages/ToolCard'
import { ToolResultCard } from './messages/ToolResultCard'
import { ThinkingCard } from './messages/ThinkingCard'
import { TodoCard } from './messages/TodoCard'
import { SystemCard } from './messages/SystemCard'
import { ResultCard } from './messages/ResultCard'
import { LoadingIndicator } from './messages/LoadingIndicator'
import { ErrorCard } from './messages/ErrorCard'

interface ChatMessagesProps {
  messages: AllMessage[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const renderMessage = (message: AllMessage, index: number) => {
    const key = `${message.timestamp}-${index}`

    if (isChatMessage(message)) {
      return <ChatBubble key={key} message={message} />
    }
    if (isToolMessage(message)) {
      return <ToolCard key={key} message={message} />
    }
    if (isToolResultMessage(message)) {
      return <ToolResultCard key={key} message={message} />
    }
    if (isThinkingMessage(message)) {
      return <ThinkingCard key={key} message={message} />
    }
    if (isTodoMessage(message)) {
      return <TodoCard key={key} message={message} />
    }
    if (isSystemMessage(message)) {
      return <SystemCard key={key} message={message} />
    }
    if (isResultMessage(message)) {
      return <ResultCard key={key} message={message} />
    }
    if (isErrorMessage(message)) {
      return <ErrorCard key={key} message={message} />
    }

    return null
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-white rounded-lg border border-slate-200 p-4"
      >
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-lg font-medium">Start a conversation with Claude</p>
          <p className="text-sm mt-2">Type a message or use a quick command from the sidebar</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-white rounded-lg border border-slate-200 p-4"
    >
      <div className="space-y-3">
        {messages.map(renderMessage)}
        {isLoading && <LoadingIndicator />}
        <div ref={endRef} />
      </div>
    </div>
  )
}
