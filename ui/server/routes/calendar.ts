import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { CalendarEntry, ContentLogEntry } from '../types.js'

export function createCalendarRoutes(projectRoot: string): Router {
  const router = Router()
  const schedulePath = path.join(projectRoot, 'marketing', 'calendar', 'schedule.json')
  const contentLogPath = path.join(projectRoot, 'marketing', 'calendar', 'content-log.csv')

  function readSchedule(): { entries: CalendarEntry[] } {
    try {
      const raw = fs.readFileSync(schedulePath, 'utf-8')
      return JSON.parse(raw)
    } catch {
      return { entries: [] }
    }
  }

  function writeSchedule(data: { entries: CalendarEntry[] }) {
    fs.writeFileSync(schedulePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  }

  function parseContentLog(): ContentLogEntry[] {
    try {
      const raw = fs.readFileSync(contentLogPath, 'utf-8')
      const lines = raw.trim().split('\n')
      if (lines.length < 2) return []

      // Skip header row
      return lines.slice(1).filter(line => line.trim()).map(line => {
        // Simple CSV parse: split by comma, handling quoted fields
        const fields: string[] = []
        let current = ''
        let inQuotes = false
        for (const char of line) {
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            fields.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        fields.push(current.trim())

        return {
          date: fields[0] || '',
          founder: fields[1] || '',
          pillar: fields[2] || '',
          topic: fields[3] || '',
          channel: fields[4] || '',
          url: fields[5] || '',
        }
      })
    } catch {
      return []
    }
  }

  // GET /api/calendar - get schedule entries, optionally filtered by date range
  router.get('/', (req, res) => {
    try {
      const { start, end } = req.query as { start?: string; end?: string }
      const schedule = readSchedule()
      let entries = schedule.entries

      if (start) {
        entries = entries.filter(e => e.date >= start)
      }
      if (end) {
        entries = entries.filter(e => e.date <= end)
      }

      res.json({ entries })
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to read schedule', message: err.message })
    }
  })

  // GET /api/calendar/log - get content log entries, optionally filtered by date range
  router.get('/log', (req, res) => {
    try {
      const { start, end } = req.query as { start?: string; end?: string }
      let entries = parseContentLog()

      if (start) {
        entries = entries.filter(e => e.date >= start)
      }
      if (end) {
        entries = entries.filter(e => e.date <= end)
      }

      res.json({ entries })
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to read content log', message: err.message })
    }
  })

  // POST /api/calendar/entry - create a new entry
  router.post('/entry', (req, res) => {
    try {
      const { date, founder, type, title, notes } = req.body

      if (!date || !founder || !type || !title) {
        res.status(400).json({ error: 'Missing required fields: date, founder, type, title' })
        return
      }

      const now = new Date().toISOString()
      const entry: CalendarEntry = {
        id: `${date}-${founder}-${type}-${Date.now()}`,
        date,
        founder,
        type,
        title,
        status: 'planned',
        notes: notes || '',
        filePath: null,
        createdAt: now,
        updatedAt: now,
      }

      const schedule = readSchedule()
      schedule.entries.push(entry)
      writeSchedule(schedule)

      res.json({ success: true, entry })
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create entry', message: err.message })
    }
  })

  // PUT /api/calendar/entry/:id - update an entry
  router.put('/entry/:id', (req, res) => {
    try {
      const { id } = req.params
      const updates = req.body

      const schedule = readSchedule()
      const index = schedule.entries.findIndex(e => e.id === id)

      if (index === -1) {
        res.status(404).json({ error: 'Entry not found' })
        return
      }

      const entry = schedule.entries[index]
      const updatedEntry: CalendarEntry = {
        ...entry,
        ...(updates.date !== undefined && { date: updates.date }),
        ...(updates.founder !== undefined && { founder: updates.founder }),
        ...(updates.type !== undefined && { type: updates.type }),
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.notes !== undefined && { notes: updates.notes }),
        ...(updates.filePath !== undefined && { filePath: updates.filePath }),
        updatedAt: new Date().toISOString(),
      }

      schedule.entries[index] = updatedEntry
      writeSchedule(schedule)

      res.json({ success: true, entry: updatedEntry })
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update entry', message: err.message })
    }
  })

  // DELETE /api/calendar/entry/:id - delete an entry
  router.delete('/entry/:id', (req, res) => {
    try {
      const { id } = req.params

      const schedule = readSchedule()
      const index = schedule.entries.findIndex(e => e.id === id)

      if (index === -1) {
        res.status(404).json({ error: 'Entry not found' })
        return
      }

      schedule.entries.splice(index, 1)
      writeSchedule(schedule)

      res.json({ success: true })
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete entry', message: err.message })
    }
  })

  return router
}
