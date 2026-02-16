import express from 'express'
import cors from 'cors'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

import { SessionManager } from './services/sessions.js'
import { FileWatcher } from './services/fileWatcher.js'
import { createPipelineRoutes } from './routes/pipeline.js'
import { createSessionRoutes } from './routes/sessions.js'
import { createNewsletterRoutes } from './routes/newsletter.js'
import { createCalendarRoutes } from './routes/calendar.js'
import { createActivityRoutes } from './routes/activity.js'
import { handleChatRequest } from './handlers/chat.js'
import { handleAbortRequest } from './handlers/abort.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
let wss: WebSocketServer

// Get project root (parent of ui/)
const projectRoot = path.resolve(__dirname, '../..')
const marketingRoot = path.join(projectRoot, 'marketing')

// Middleware
app.use(cors())
app.use(express.json())

// Initialize services
const sessionManager = new SessionManager(path.join(__dirname, '../data'))
const fileWatcher = new FileWatcher(marketingRoot)

// Shared abort controllers for chat requests
const requestAbortControllers = new Map<string, AbortController>()

// Track connected clients
const clients = new Map<WebSocket, { sessionId?: string }>()

function setupWebSocket() {
  wss.on('connection', (ws) => {
    console.log('Client connected')
    clients.set(ws, {})

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString())
        await handleClientMessage(ws, message)
      } catch (err) {
        console.error('Failed to parse message:', err)
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }))
      }
    })

    ws.on('close', () => {
      console.log('Client disconnected')
      clients.delete(ws)
    })

    // Send initial sessions list
    const sessions = sessionManager.getSessions()
    ws.send(JSON.stringify({ type: 'sessions-update', sessions }))
  })
}

async function handleClientMessage(ws: WebSocket, message: any) {
  const clientState = clients.get(ws)
  if (!clientState) return

  switch (message.type) {
    case 'create-session': {
      const session = sessionManager.createSession(message.name)

      // Attach this client to the session
      clientState.sessionId = session.id

      // Broadcast to all clients
      broadcastAll({ type: 'sessions-update', sessions: sessionManager.getSessions() })

      ws.send(JSON.stringify({ type: 'session-created', session }))
      break
    }

    case 'attach': {
      const { sessionId } = message
      clientState.sessionId = sessionId
      ws.send(JSON.stringify({ type: 'attached', sessionId }))
      break
    }

    case 'subscribe-pipeline': {
      // Send current pipeline state
      const files = fileWatcher.getAllFiles()
      ws.send(JSON.stringify({ type: 'pipeline-update', files }))
      break
    }
  }
}

function broadcast(sessionId: string, message: any) {
  const json = JSON.stringify(message)
  clients.forEach((state, ws) => {
    if (state.sessionId === sessionId && ws.readyState === WebSocket.OPEN) {
      ws.send(json)
    }
  })
}

function broadcastAll(message: any) {
  const json = JSON.stringify(message)
  clients.forEach((state, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(json)
    }
  })
}

// File watcher events
fileWatcher.on('file-added', (file) => {
  // Find active session and add file
  const activeSession = sessionManager.getActiveSession()
  if (activeSession) {
    sessionManager.addFileToSession(activeSession.id, file)
    broadcast(activeSession.id, { type: 'content-added', sessionId: activeSession.id, file })
  }
})

fileWatcher.on('file-moved', (file, from, to) => {
  broadcastAll({ type: 'content-moved', file, from, to })
})

// API Routes - Chat and Abort
app.post('/api/chat', (req, res) => {
  handleChatRequest(req, res, requestAbortControllers)
})

app.post('/api/abort/:requestId', (req, res) => {
  handleAbortRequest(req, res, requestAbortControllers)
})

// API Routes - Existing
app.use('/api/sessions', createSessionRoutes(sessionManager))
app.use('/api/pipeline', createPipelineRoutes(marketingRoot, fileWatcher))
app.use('/api/newsletter', createNewsletterRoutes(projectRoot))
app.use('/api/calendar', createCalendarRoutes(projectRoot))
app.use('/api/activity', createActivityRoutes(projectRoot))

// Config endpoint - provides dynamic paths to frontend
app.get('/api/config', (req, res) => {
  res.json({ projectRoot, marketingRoot })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', projectRoot, marketingRoot })
})

// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or set PORT env variable.`)
    console.error('To find and kill the process: lsof -i :' + PORT)
  } else {
    console.error('Server error:', err)
  }
  process.exit(1)
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Project root: ${projectRoot}`)
  console.log(`Marketing root: ${marketingRoot}`)

  // Create WebSocket server after successful listen
  wss = new WebSocketServer({ server })
  setupWebSocket()

  fileWatcher.start()
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...')
  fileWatcher.stop()
  process.exit(0)
})
