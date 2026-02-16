import { Router } from 'express'
import { execSync } from 'child_process'

interface ActivityFile {
  action: 'added' | 'modified' | 'deleted' | 'renamed'
  path: string
  stage?: string
  type?: string
}

interface Activity {
  id: string
  author: string
  relativeTime: string
  message: string
  files: ActivityFile[]
}

const GIT_ACTION_MAP: Record<string, ActivityFile['action']> = {
  A: 'added',
  M: 'modified',
  D: 'deleted',
  R: 'renamed',
}

const STAGES = ['to-review', 'to-post', 'posted']
const CONTENT_TYPES = ['linkedin', 'newsletter', 'community', 'blog', 'graphics']

function parseFilePath(filePath: string): { stage?: string; type?: string } {
  // marketing/to-review/linkedin/matt/file.md
  const parts = filePath.replace(/^marketing\//, '').split('/')
  const stage = STAGES.includes(parts[0]) ? parts[0] : undefined
  const type = parts[1] && CONTENT_TYPES.includes(parts[1]) ? parts[1] : undefined
  return { stage, type }
}

export function createActivityRoutes(projectRoot: string): Router {
  const router = Router()

  router.get('/', (req, res) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50)

    try {
      const gitLog = execSync(
        `git log --format="%h|%an|%ar|%s" --name-status -n ${limit} -- marketing/`,
        { cwd: projectRoot, encoding: 'utf-8', timeout: 5000 }
      )

      const activities = parseGitLog(gitLog)
      res.json({ activities })
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to read git log', message: err.message })
    }
  })

  return router
}

function parseGitLog(raw: string): Activity[] {
  const activities: Activity[] = []
  const lines = raw.trim().split('\n')

  let current: Activity | null = null

  for (const line of lines) {
    if (!line.trim()) {
      if (current && current.files.length > 0) {
        activities.push(current)
        current = null
      }
      continue
    }

    // Check if it's a commit header line (hash|author|time|message)
    if (line.includes('|') && !line.startsWith('\t') && !line.match(/^[AMDRC]\t/)) {
      if (current && current.files.length > 0) {
        activities.push(current)
      }

      const parts = line.split('|')
      if (parts.length >= 4) {
        current = {
          id: parts[0],
          author: parts[1],
          relativeTime: parts[2],
          message: parts.slice(3).join('|'), // message might contain |
          files: [],
        }
      }
      continue
    }

    // File status line: A\tpath or M\tpath
    if (current) {
      const match = line.match(/^([AMDRC])\d*\t(.+)/)
      if (match) {
        const action = GIT_ACTION_MAP[match[1]] || 'modified'
        const filePath = match[2]
        const { stage, type } = parseFilePath(filePath)

        current.files.push({ action, path: filePath, stage, type })
      }
    }
  }

  // Don't forget the last entry
  if (current && current.files.length > 0) {
    activities.push(current)
  }

  return activities
}
