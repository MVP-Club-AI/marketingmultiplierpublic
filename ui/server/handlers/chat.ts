import { Request, Response } from 'express'
import { query, type PermissionMode } from '@anthropic-ai/claude-code'

export interface ChatRequest {
  message: string
  sessionId?: string
  requestId: string
  allowedTools?: string[]
  workingDirectory?: string
  permissionMode?: PermissionMode
}

export interface StreamResponse {
  type: 'claude_json' | 'error' | 'done' | 'aborted'
  data?: unknown
  error?: string
}

/**
 * Executes a Claude command and yields streaming responses
 */
async function* executeClaudeCommand(
  message: string,
  requestId: string,
  abortControllers: Map<string, AbortController>,
  sessionId?: string,
  allowedTools?: string[],
  workingDirectory?: string,
  permissionMode?: PermissionMode,
): AsyncGenerator<StreamResponse> {
  const abortController = new AbortController()
  abortControllers.set(requestId, abortController)

  try {
    // Process slash commands - remove leading '/'
    let processedMessage = message
    if (message.startsWith('/')) {
      processedMessage = message.substring(1)
    }

    for await (const sdkMessage of query({
      prompt: processedMessage,
      options: {
        abortController,
        ...(sessionId ? { resume: sessionId } : {}),
        ...(allowedTools ? { allowedTools } : {}),
        ...(workingDirectory ? { cwd: workingDirectory } : {}),
        ...(permissionMode ? { permissionMode } : {}),
      },
    })) {
      yield { type: 'claude_json', data: sdkMessage }
    }

    yield { type: 'done' }
  } catch (error) {
    console.error('Claude Code execution failed:', error)
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    abortControllers.delete(requestId)
  }
}

/**
 * Handles POST /api/chat requests with streaming NDJSON responses
 */
export async function handleChatRequest(
  req: Request,
  res: Response,
  abortControllers: Map<string, AbortController>,
) {
  const chatRequest: ChatRequest = req.body

  console.log('Received chat request:', {
    message: chatRequest.message.substring(0, 50),
    sessionId: chatRequest.sessionId,
    requestId: chatRequest.requestId,
  })

  // Set headers for NDJSON streaming
  res.setHeader('Content-Type', 'application/x-ndjson')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    for await (const chunk of executeClaudeCommand(
      chatRequest.message,
      chatRequest.requestId,
      abortControllers,
      chatRequest.sessionId,
      chatRequest.allowedTools,
      chatRequest.workingDirectory,
      chatRequest.permissionMode,
    )) {
      res.write(JSON.stringify(chunk) + '\n')
    }
  } catch (error) {
    const errorResponse: StreamResponse = {
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    }
    res.write(JSON.stringify(errorResponse) + '\n')
  } finally {
    res.end()
  }
}
