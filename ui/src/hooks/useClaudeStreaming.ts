import { useCallback, useMemo } from 'react'
import { MessageProcessor } from '../lib/messageProcessor'
import type { AllMessage, StreamResponse, ChatRequest, ErrorMessage, PermissionRequest } from '../lib/sdkTypes'

export interface StreamContext {
  addMessages: (msgs: AllMessage[]) => void
  onSessionId?: (id: string) => void
  onError?: (error: string) => void
  onDone?: () => void
  onPermissionRequest?: (request: PermissionRequest) => void
}

export function useClaudeStreaming() {
  const processor = useMemo(() => new MessageProcessor(), [])

  /**
   * Process a single line from the NDJSON stream
   */
  const processStreamLine = useCallback((line: string, context: StreamContext) => {
    if (!line.trim()) return

    try {
      const data: StreamResponse = JSON.parse(line)

      switch (data.type) {
        case 'claude_json':
          if (data.data) {
            const sdkMessage = data.data as any
            const timestamp = Date.now()

            // Extract session ID if present
            const sessionId = processor.extractSessionId(sdkMessage)
            if (sessionId && context.onSessionId) {
              context.onSessionId(sessionId)
            }

            // Check for permission requests in user messages (tool_result with errors)
            if (sdkMessage.type === 'user' && sdkMessage.message?.content && context.onPermissionRequest) {
              for (const item of sdkMessage.message.content) {
                if (item.type === 'tool_result' && item.is_error) {
                  const content = typeof item.content === 'string' ? item.content : JSON.stringify(item.content)
                  // Get tool name from cache
                  const toolInfo = processor.getToolInfo(item.tool_use_id)
                  if (toolInfo && content.includes("haven't granted")) {
                    const permRequest = processor.extractPermissionRequest(content, toolInfo.name, item.tool_use_id)
                    if (permRequest) {
                      // Add file path from tool input if available
                      if (toolInfo.input?.file_path) {
                        permRequest.filePath = String(toolInfo.input.file_path)
                      }
                      if (toolInfo.input?.command) {
                        permRequest.command = String(toolInfo.input.command)
                      }
                      context.onPermissionRequest(permRequest)
                    }
                  }
                }
              }
            }

            // Process and add messages
            const messages = processor.processSDKMessage(sdkMessage, timestamp)
            if (messages.length > 0) {
              context.addMessages(messages)
            }
          }
          break

        case 'error':
          if (context.onError) {
            context.onError(data.error || 'Unknown error')
          } else {
            const errorMsg: ErrorMessage = {
              type: 'error',
              message: data.error || 'Unknown error',
              timestamp: Date.now(),
            }
            context.addMessages([errorMsg])
          }
          break

        case 'done':
          context.onDone?.()
          break

        case 'aborted':
          // Request was aborted, no action needed
          break
      }
    } catch (err) {
      console.error('Failed to parse stream line:', line, err)
    }
  }, [processor])

  /**
   * Send a chat message and process the streaming response
   */
  const sendChatMessage = useCallback(async (
    request: ChatRequest,
    context: StreamContext,
  ): Promise<void> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          processStreamLine(line, context)
        }
      }

      // Process any remaining data
      if (buffer.trim()) {
        processStreamLine(buffer, context)
      }
    } finally {
      reader.releaseLock()
    }
  }, [processStreamLine])

  /**
   * Clear the message processor cache (call when starting new session)
   */
  const clearCache = useCallback(() => {
    processor.clearCache()
  }, [processor])

  return {
    processStreamLine,
    sendChatMessage,
    clearCache,
  }
}
