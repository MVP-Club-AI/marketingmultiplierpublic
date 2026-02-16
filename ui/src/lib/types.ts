// Re-export SDK types for convenience
export type {
  AllMessage,
  ChatMessage,
  ToolMessage,
  ToolResultMessage,
  ThinkingMessage,
  TodoMessage,
  TodoItem,
  SystemInitMessage,
  ResultMessage,
  ErrorMessage,
  ChatRequest,
  StreamResponse,
} from './sdkTypes'

export {
  isChatMessage,
  isToolMessage,
  isToolResultMessage,
  isThinkingMessage,
  isTodoMessage,
  isSystemMessage,
  isResultMessage,
  isErrorMessage,
} from './sdkTypes'

// Session types
export interface ContentFile {
  path: string
  type: 'linkedin' | 'newsletter' | 'community' | 'blog' | 'graphics'
  founder?: 'founder-1' | 'founder-2' | 'founder-3' | 'company'
  stage: 'to-review' | 'to-post' | 'posted'
  title?: string
  pillar?: string
  date?: string
  createdAt: string
}

export interface Session {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'completed' | 'archived'
  contentFiles: ContentFile[]
}

export interface SessionsData {
  sessions: Session[]
  activeSessionId: string | null
}

// WebSocket message types (simplified - no terminal I/O)
export type ClientMessage =
  | { type: 'attach'; sessionId: string }
  | { type: 'create-session'; name?: string }
  | { type: 'subscribe-pipeline' }

export type ServerMessage =
  | { type: 'session-created'; session: Session }
  | { type: 'session-ended'; sessionId: string }
  | { type: 'content-added'; sessionId: string; file: ContentFile }
  | { type: 'content-moved'; file: ContentFile; from: string; to: string }
  | { type: 'pipeline-update'; files: ContentFile[] }
  | { type: 'sessions-update'; sessions: Session[] }
  | { type: 'error'; message: string }
  | { type: 'attached'; sessionId: string }

// Calendar types
export type ContentType = 'linkedin' | 'newsletter' | 'community' | 'blog' | 'graphics'
export type Founder = 'founder-1' | 'founder-2' | 'founder-3' | 'company'
export type CalendarEntryStatus = 'planned' | 'in-progress' | 'ready' | 'posted'

export interface CalendarEntry {
  id: string
  date: string           // YYYY-MM-DD
  founder: Founder
  type: ContentType
  title: string
  status: CalendarEntryStatus
  notes: string
  filePath: string | null
  createdAt: string      // ISO 8601
  updatedAt: string      // ISO 8601
}

export interface ContentLogEntry {
  date: string
  founder: string
  pillar: string
  topic: string
  channel: string
  url: string
}

// Pipeline types
export interface PipelineState {
  'to-review': ContentFile[]
  'to-post': ContentFile[]
  'posted': ContentFile[]
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
