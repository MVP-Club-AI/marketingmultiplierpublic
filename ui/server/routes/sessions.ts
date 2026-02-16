import { Router } from 'express'
import { SessionManager } from '../services/sessions.js'

export function createSessionRoutes(sessionManager: SessionManager): Router {
  const router = Router()

  // Get all sessions
  router.get('/', (req, res) => {
    const sessions = sessionManager.getSessions()
    const activeSession = sessionManager.getActiveSession()
    res.json({
      sessions,
      activeSessionId: activeSession?.id || null,
    })
  })

  // Get single session
  router.get('/:id', (req, res) => {
    const session = sessionManager.getSession(req.params.id)
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    res.json(session)
  })

  // Create session
  router.post('/', (req, res) => {
    const { name } = req.body
    const session = sessionManager.createSession(name)
    res.json(session)
  })

  // Update session
  router.patch('/:id', (req, res) => {
    const session = sessionManager.updateSession(req.params.id, req.body)
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    res.json(session)
  })

  // Set active session
  router.post('/:id/activate', (req, res) => {
    const session = sessionManager.getSession(req.params.id)
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    sessionManager.setActiveSession(req.params.id)
    res.json({ success: true })
  })

  // Delete session
  router.delete('/:id', (req, res) => {
    const success = sessionManager.deleteSession(req.params.id)
    if (!success) {
      return res.status(404).json({ error: 'Session not found' })
    }
    res.json({ success: true })
  })

  return router
}
