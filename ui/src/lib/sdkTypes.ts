// SDK message types for Claude Code integration

// Chat message for user/assistant interactions
export interface ChatMessage {
  type: 'chat'
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Tool invocation message
export interface ToolMessage {
  type: 'tool'
  name: string
  input: Record<string, unknown>
  timestamp: number
}

// Tool result message
export interface ToolResultMessage {
  type: 'tool_result'
  toolName: string
  content: string
  summary: string
  timestamp: number
  isError?: boolean
}

// Extended thinking message
export interface ThinkingMessage {
  type: 'thinking'
  content: string
  timestamp: number
}

// Todo item
export interface TodoItem {
  content: string
  status: 'pending' | 'in_progress' | 'completed'
  activeForm?: string
}

// Todo list message
export interface TodoMessage {
  type: 'todo'
  todos: TodoItem[]
  timestamp: number
}

// System initialization message
export interface SystemInitMessage {
  type: 'system'
  subtype: 'init'
  model: string
  sessionId: string
  tools: string[]
  cwd: string
  timestamp: number
}

// Result summary message
export interface ResultMessage {
  type: 'result'
  durationMs: number
  totalCostUsd: number
  usage: {
    inputTokens: number
    outputTokens: number
  }
  timestamp: number
}

// Error message
export interface ErrorMessage {
  type: 'error'
  message: string
  timestamp: number
}

// Permission request (detected from tool results)
export interface PermissionRequest {
  toolName: string
  toolId: string
  description: string
  filePath?: string
  command?: string
}

// Union type for all UI messages
export type AllMessage =
  | ChatMessage
  | ToolMessage
  | ToolResultMessage
  | ThinkingMessage
  | TodoMessage
  | SystemInitMessage
  | ResultMessage
  | ErrorMessage

// Type guards
export function isChatMessage(msg: AllMessage): msg is ChatMessage {
  return msg.type === 'chat'
}

export function isToolMessage(msg: AllMessage): msg is ToolMessage {
  return msg.type === 'tool'
}

export function isToolResultMessage(msg: AllMessage): msg is ToolResultMessage {
  return msg.type === 'tool_result'
}

export function isThinkingMessage(msg: AllMessage): msg is ThinkingMessage {
  return msg.type === 'thinking'
}

export function isTodoMessage(msg: AllMessage): msg is TodoMessage {
  return msg.type === 'todo'
}

export function isSystemMessage(msg: AllMessage): msg is SystemInitMessage {
  return msg.type === 'system'
}

export function isResultMessage(msg: AllMessage): msg is ResultMessage {
  return msg.type === 'result'
}

export function isErrorMessage(msg: AllMessage): msg is ErrorMessage {
  return msg.type === 'error'
}

// Chat API request
export interface ChatRequest {
  message: string
  sessionId?: string
  requestId: string
  allowedTools?: string[]
  workingDirectory?: string
  permissionMode?: 'default' | 'plan' | 'acceptEdits'
}

// Stream response from server
export interface StreamResponse {
  type: 'claude_json' | 'error' | 'done' | 'aborted'
  data?: unknown
  error?: string
}
