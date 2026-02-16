import fs from 'fs'
import path from 'path'
import { Session, ContentFile, SessionsData } from '../types.js'

export class SessionManager {
  private dataDir: string
  private sessionsFile: string
  private data: SessionsData

  constructor(dataDir: string) {
    this.dataDir = dataDir
    this.sessionsFile = path.join(dataDir, 'sessions.json')
    this.data = this.load()
  }

  private load(): SessionsData {
    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true })
    }

    // Load or create sessions file
    if (fs.existsSync(this.sessionsFile)) {
      try {
        const content = fs.readFileSync(this.sessionsFile, 'utf-8')
        return JSON.parse(content)
      } catch (err) {
        console.error('Failed to load sessions:', err)
      }
    }

    return { sessions: [], activeSessionId: null }
  }

  private save() {
    fs.writeFileSync(this.sessionsFile, JSON.stringify(this.data, null, 2))
  }

  getSessions(): Session[] {
    return this.data.sessions
  }

  getSession(id: string): Session | undefined {
    return this.data.sessions.find(s => s.id === id)
  }

  getActiveSession(): Session | undefined {
    if (this.data.activeSessionId) {
      return this.getSession(this.data.activeSessionId)
    }
    return undefined
  }

  createSession(name?: string): Session {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const sessionNum = this.data.sessions.filter(s => s.id.startsWith(dateStr)).length + 1

    const id = name
      ? `${dateStr}_${name.toLowerCase().replace(/\s+/g, '-')}`
      : `${dateStr}_session-${sessionNum}`

    const session: Session = {
      id,
      name: name || `Session ${sessionNum}`,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: 'active',
      contentFiles: [],
    }

    this.data.sessions.unshift(session)
    this.data.activeSessionId = session.id
    this.save()

    return session
  }

  updateSession(id: string, updates: Partial<Session>): Session | undefined {
    const index = this.data.sessions.findIndex(s => s.id === id)
    if (index === -1) return undefined

    this.data.sessions[index] = {
      ...this.data.sessions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.save()

    return this.data.sessions[index]
  }

  setActiveSession(id: string) {
    this.data.activeSessionId = id
    this.save()
  }

  addFileToSession(sessionId: string, file: ContentFile): boolean {
    const session = this.getSession(sessionId)
    if (!session) return false

    // Check if file already exists in session
    const exists = session.contentFiles.some(f => f.path === file.path)
    if (exists) return false

    session.contentFiles.push(file)
    session.updatedAt = new Date().toISOString()
    this.save()

    return true
  }

  updateFileInSession(sessionId: string, path: string, updates: Partial<ContentFile>): boolean {
    const session = this.getSession(sessionId)
    if (!session) return false

    const fileIndex = session.contentFiles.findIndex(f => f.path === path)
    if (fileIndex === -1) return false

    session.contentFiles[fileIndex] = {
      ...session.contentFiles[fileIndex],
      ...updates,
    }
    session.updatedAt = new Date().toISOString()
    this.save()

    return true
  }

  removeFileFromSession(sessionId: string, path: string): boolean {
    const session = this.getSession(sessionId)
    if (!session) return false

    const initialLength = session.contentFiles.length
    session.contentFiles = session.contentFiles.filter(f => f.path !== path)

    if (session.contentFiles.length !== initialLength) {
      session.updatedAt = new Date().toISOString()
      this.save()
      return true
    }

    return false
  }

  deleteSession(id: string): boolean {
    const index = this.data.sessions.findIndex(s => s.id === id)
    if (index === -1) return false

    this.data.sessions.splice(index, 1)
    if (this.data.activeSessionId === id) {
      this.data.activeSessionId = this.data.sessions[0]?.id || null
    }
    this.save()

    return true
  }
}
