// Session types
export interface ContentFile {
  path: string
  type: 'linkedin' | 'newsletter' | 'community' | 'blog' | 'graphics'
  founder?: 'matt' | 'ryan' | 'jill' | 'company'
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

// Calendar types
export type ContentType = 'linkedin' | 'newsletter' | 'community' | 'blog' | 'graphics'
export type Founder = 'matt' | 'ryan' | 'jill' | 'company'
export type CalendarEntryStatus = 'planned' | 'in-progress' | 'ready' | 'posted'

export interface CalendarEntry {
  id: string
  date: string
  founder: Founder
  type: ContentType
  title: string
  status: CalendarEntryStatus
  notes: string
  filePath: string | null
  createdAt: string
  updatedAt: string
}

export interface ContentLogEntry {
  date: string
  founder: string
  pillar: string
  topic: string
  channel: string
  url: string
}
