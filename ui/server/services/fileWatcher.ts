import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { EventEmitter } from 'events'
import { ContentFile } from '../types.js'

const WATCHED_FOLDERS = ['to-review', 'to-post', 'posted']
const CONTENT_TYPES = ['linkedin', 'newsletter', 'community', 'blog', 'graphics']

export class FileWatcher extends EventEmitter {
  private marketingRoot: string
  private watcher: chokidar.FSWatcher | null = null
  private files: Map<string, ContentFile> = new Map()

  constructor(marketingRoot: string) {
    super()
    this.marketingRoot = marketingRoot
  }

  start() {
    const watchPaths = WATCHED_FOLDERS.map(f => path.join(this.marketingRoot, f))

    this.watcher = chokidar.watch(watchPaths, {
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    })

    this.watcher.on('add', (filePath) => this.handleFileAdd(filePath))
    this.watcher.on('change', (filePath) => this.handleFileChange(filePath))
    this.watcher.on('unlink', (filePath) => this.handleFileDelete(filePath))

    console.log('File watcher started')
  }

  stop() {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
    console.log('File watcher stopped')
  }

  private handleFileAdd(filePath: string) {
    const file = this.parseFile(filePath)
    if (file) {
      const isNew = !this.files.has(file.path)
      this.files.set(file.path, file)

      if (isNew) {
        console.log('File added:', file.path)
        this.emit('file-added', file)
      }
    }
  }

  private handleFileChange(filePath: string) {
    const file = this.parseFile(filePath)
    if (file) {
      this.files.set(file.path, file)
      this.emit('file-changed', file)
    }
  }

  private handleFileDelete(filePath: string) {
    const relativePath = path.relative(this.marketingRoot, filePath).replace(/\\/g, '/')
    const fullPath = `marketing/${relativePath}`

    if (this.files.has(fullPath)) {
      const file = this.files.get(fullPath)
      this.files.delete(fullPath)
      this.emit('file-deleted', file)
    }
  }

  private static SUPPORTED_EXTENSIONS = ['.md', '.html', '.htm', '.svg', '.png', '.jpg', '.jpeg']
  private static IMAGE_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg']

  private parseFile(filePath: string): ContentFile | null {
    const ext = path.extname(filePath).toLowerCase()
    if (!FileWatcher.SUPPORTED_EXTENSIONS.includes(ext)) return null

    const relativePath = path.relative(this.marketingRoot, filePath).replace(/\\/g, '/')
    const parts = relativePath.split('/')

    // parts: [stage, type?, founder?, filename] or [stage, type?, filename]
    if (parts.length < 2) return null

    const stage = parts[0] as 'to-review' | 'to-post' | 'posted'
    if (!WATCHED_FOLDERS.includes(stage)) return null

    // Determine type and founder from path
    let type: ContentFile['type'] = 'linkedin'
    let founder: ContentFile['founder'] | undefined
    let filename = parts[parts.length - 1]

    if (parts.length >= 2 && CONTENT_TYPES.includes(parts[1])) {
      type = parts[1] as ContentFile['type']
    }

    // Force graphics type for image files
    if (FileWatcher.IMAGE_EXTENSIONS.includes(ext)) {
      type = 'graphics'
    }

    if (parts.length >= 3) {
      const possibleFounder = parts[2]
      if (['matt', 'ryan', 'jill', 'company'].includes(possibleFounder)) {
        founder = possibleFounder as ContentFile['founder']
      }
    }

    // Parse content based on file type
    let title: string | undefined
    let pillar: string | undefined
    let date: string | undefined

    if (ext === '.md') {
      // Markdown: parse frontmatter
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(content)

        title = data.title || data.topic
        pillar = data.pillar
        date = data.date

        if (data.founder) {
          founder = data.founder.toLowerCase() as ContentFile['founder']
        }
      } catch (err) {
        // Ignore parse errors
      }
    } else if (ext === '.html' || ext === '.htm') {
      // HTML: extract title from <title> tag
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const titleMatch = content.match(/<title>(.*?)<\/title>/i)
        if (titleMatch) {
          title = titleMatch[1]
        }
      } catch (err) {
        // Ignore read errors
      }
    }
    // Image files: skip content parsing, title from filename only

    // Generate title from filename if not extracted from content
    if (!title) {
      title = filename
        .replace(/^\d{4}-\d{2}-\d{2}_?/, '') // Remove date prefix
        .replace(/\.(md|html?)$/, '')
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
    }

    return {
      path: `marketing/${relativePath}`,
      type,
      founder,
      stage,
      title,
      pillar,
      date,
      createdAt: new Date().toISOString(),
    }
  }

  getAllFiles(): ContentFile[] {
    return Array.from(this.files.values())
  }

  getFilesByStage(stage: 'to-review' | 'to-post' | 'posted'): ContentFile[] {
    return this.getAllFiles().filter(f => f.stage === stage)
  }
}
