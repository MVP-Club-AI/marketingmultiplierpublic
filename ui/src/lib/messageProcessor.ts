import type {
  AllMessage,
  ChatMessage,
  ToolMessage,
  ToolResultMessage,
  ThinkingMessage,
  TodoMessage,
  SystemInitMessage,
  ResultMessage,
  ErrorMessage,
  PermissionRequest,
} from './sdkTypes'

/**
 * Processes SDK messages from Claude Code into UI-friendly message types.
 * Maintains a cache of tool uses to correlate tool_use with tool_result.
 */
export class MessageProcessor {
  private toolUseCache = new Map<string, { name: string; input: Record<string, unknown> }>()

  /**
   * Clear the tool use cache (call when starting a new conversation)
   */
  clearCache(): void {
    this.toolUseCache.clear()
  }

  /**
   * Get tool info from cache by ID
   */
  getToolInfo(toolId: string): { name: string; input: Record<string, unknown> } | undefined {
    return this.toolUseCache.get(toolId)
  }

  /**
   * Process an SDK message and return UI messages
   */
  processSDKMessage(sdkMessage: any, timestamp: number): AllMessage[] {
    const messages: AllMessage[] = []

    switch (sdkMessage.type) {
      case 'system':
        if (sdkMessage.subtype === 'init') {
          messages.push({
            type: 'system',
            subtype: 'init',
            model: sdkMessage.model || 'unknown',
            sessionId: sdkMessage.session_id || '',
            tools: sdkMessage.tools || [],
            cwd: sdkMessage.cwd || '',
            timestamp,
          } as SystemInitMessage)
        }
        break

      case 'assistant':
        // Extract session ID from first assistant message
        if (sdkMessage.session_id) {
          // Session ID is available on this message
        }

        if (sdkMessage.message?.content) {
          for (const item of sdkMessage.message.content) {
            if (item.type === 'text' && item.text) {
              messages.push({
                type: 'chat',
                role: 'assistant',
                content: item.text,
                timestamp,
              } as ChatMessage)
            } else if (item.type === 'tool_use') {
              // Cache the tool use for later correlation with tool_result
              this.toolUseCache.set(item.id, {
                name: item.name,
                input: item.input,
              })
              messages.push({
                type: 'tool',
                name: item.name,
                input: item.input || {},
                timestamp,
              } as ToolMessage)
            } else if (item.type === 'thinking' && item.thinking) {
              messages.push({
                type: 'thinking',
                content: item.thinking,
                timestamp,
              } as ThinkingMessage)
            }
          }
        }
        break

      case 'user':
        // User messages from SDK contain tool_results
        if (sdkMessage.message?.content) {
          for (const item of sdkMessage.message.content) {
            if (item.type === 'tool_result') {
              const cached = this.toolUseCache.get(item.tool_use_id)
              const content = typeof item.content === 'string'
                ? item.content
                : JSON.stringify(item.content, null, 2)

              messages.push({
                type: 'tool_result',
                toolName: cached?.name || 'Tool',
                content,
                summary: this.generateSummary(cached?.name, content),
                isError: item.is_error || false,
                timestamp,
              } as ToolResultMessage)
            }
          }
        }
        break

      case 'result':
        messages.push({
          type: 'result',
          durationMs: sdkMessage.duration_ms || 0,
          totalCostUsd: sdkMessage.total_cost_usd || 0,
          usage: {
            inputTokens: sdkMessage.usage?.input_tokens || 0,
            outputTokens: sdkMessage.usage?.output_tokens || 0,
          },
          timestamp,
        } as ResultMessage)
        break
    }

    return messages
  }

  /**
   * Generate a short summary for tool results
   */
  private generateSummary(toolName?: string, content?: string): string {
    if (!content) return 'Completed'
    if (typeof content !== 'string') return 'Completed'

    const lines = content.split('\n').length
    const chars = content.length

    switch (toolName) {
      case 'Read':
        return `${lines} lines`
      case 'Write':
        return `${chars} chars written`
      case 'Edit':
        return 'File edited'
      case 'Bash':
        if (chars < 50) return content.trim()
        return content.substring(0, 47).trim() + '...'
      case 'Glob':
        return `${lines} files`
      case 'Grep':
        return `${lines} matches`
      default:
        return 'Completed'
    }
  }

  /**
   * Extract session ID from SDK message if available
   */
  extractSessionId(sdkMessage: any): string | null {
    if (sdkMessage.type === 'assistant' && sdkMessage.session_id) {
      return sdkMessage.session_id
    }
    if (sdkMessage.type === 'system' && sdkMessage.session_id) {
      return sdkMessage.session_id
    }
    return null
  }

  /**
   * Check if a tool result contains a permission request
   */
  extractPermissionRequest(content: string, toolName: string, toolId: string): PermissionRequest | null {
    // Pattern: "Claude requested permissions to write to /path/file.md, but you haven't granted it yet."
    const permissionPattern = /Claude requested permissions? to (\w+)(?: to)? ([^,]+), but you haven't granted it yet/i
    const match = content.match(permissionPattern)

    if (match) {
      const action = match[1] // write, read, edit, etc.
      const target = match[2].trim() // file path or command

      return {
        toolName,
        toolId,
        description: `Claude wants to ${action} ${target}`,
        filePath: toolName !== 'Bash' ? target : undefined,
        command: toolName === 'Bash' ? target : undefined,
      }
    }

    // Also check for bash command permission patterns
    if (toolName === 'Bash' && content.includes("hasn't been granted")) {
      const cmdMatch = content.match(/command[:\s]+(.+?)(?:\n|$)/i)
      return {
        toolName: 'Bash',
        toolId,
        description: 'Claude wants to run a command',
        command: cmdMatch ? cmdMatch[1].trim() : 'Unknown command',
      }
    }

    return null
  }
}
