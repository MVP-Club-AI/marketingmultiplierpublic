import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { FileWatcher } from '../services/fileWatcher.js'

export function createPipelineRoutes(marketingRoot: string, fileWatcher: FileWatcher): Router {
  const router = Router()

  // Get all pipeline files
  router.get('/', (req, res) => {
    const files = fileWatcher.getAllFiles()
    res.json({ files })
  })

  // Get files by stage
  router.get('/stage/:stage', (req, res) => {
    const stage = req.params.stage as 'to-review' | 'to-post' | 'posted'
    const files = fileWatcher.getFilesByStage(stage)
    res.json({ files })
  })

  // Read file content
  router.get('/read', (req, res) => {
    const { path: filePath } = req.query

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ error: 'Path required' })
    }

    // Resolve path relative to project root
    const fullPath = path.resolve(marketingRoot, '..', filePath)

    // Security check: ensure path is within marketing folder
    if (!fullPath.startsWith(marketingRoot)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf-8')
      res.json({ content })
    } catch (err) {
      res.status(404).json({ error: 'File not found' })
    }
  })

  // Write file content
  router.post('/write', (req, res) => {
    const { path: filePath, content } = req.body

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ error: 'Path required' })
    }

    const fullPath = path.resolve(marketingRoot, '..', filePath)

    // Security check
    if (!fullPath.startsWith(marketingRoot)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    try {
      fs.writeFileSync(fullPath, content, 'utf-8')
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ error: 'Failed to write file' })
    }
  })

  // Move file between stages
  router.post('/move', (req, res) => {
    const { path: filePath, toStage } = req.body

    if (!filePath || !toStage) {
      return res.status(400).json({ error: 'Path and toStage required' })
    }

    const validStages = ['to-review', 'to-post', 'posted']
    if (!validStages.includes(toStage)) {
      return res.status(400).json({ error: 'Invalid stage' })
    }

    const fullPath = path.resolve(marketingRoot, '..', filePath)

    // Security check
    if (!fullPath.startsWith(marketingRoot)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    try {
      // Parse current path to determine new path
      // e.g., marketing/to-review/linkedin/matt/file.md -> marketing/to-post/linkedin/matt/file.md
      const relativePath = path.relative(marketingRoot, fullPath)
      const parts = relativePath.split(path.sep)

      if (parts.length < 2) {
        return res.status(400).json({ error: 'Invalid file path' })
      }

      // Replace stage in path
      parts[0] = toStage

      const newRelativePath = parts.join(path.sep)
      const newFullPath = path.join(marketingRoot, newRelativePath)
      const newDir = path.dirname(newFullPath)

      // Ensure directory exists
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true })
      }

      // Move file
      fs.renameSync(fullPath, newFullPath)

      const newPath = `marketing/${newRelativePath.replace(/\\/g, '/')}`
      res.json({ success: true, newPath })
    } catch (err) {
      console.error('Failed to move file:', err)
      res.status(500).json({ error: 'Failed to move file' })
    }
  })

  // Delete file
  router.post('/delete', (req, res) => {
    const { path: filePath } = req.body

    if (!filePath) {
      return res.status(400).json({ error: 'Path required' })
    }

    const fullPath = path.resolve(marketingRoot, '..', filePath)

    // Security check
    if (!fullPath.startsWith(marketingRoot)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    try {
      fs.unlinkSync(fullPath)
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete file' })
    }
  })

  // Get associated images for a content file
  router.get('/images', (req, res) => {
    const { path: filePath } = req.query

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ error: 'Path required' })
    }

    const fullPath = path.resolve(marketingRoot, '..', filePath)

    if (!fullPath.startsWith(marketingRoot)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    try {
      const dir = path.dirname(fullPath)
      const baseName = path.basename(fullPath, path.extname(fullPath))
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']

      const images: string[] = []

      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)
        for (const file of files) {
          const ext = path.extname(file).toLowerCase()
          const fileBaseName = path.basename(file, ext)

          // Match files with same base name or base name as prefix
          if (imageExtensions.includes(ext) && (fileBaseName === baseName || fileBaseName.startsWith(baseName + '-') || fileBaseName.startsWith(baseName + '_'))) {
            const relativePath = path.relative(path.resolve(marketingRoot, '..'), path.join(dir, file))
            images.push(relativePath.replace(/\\/g, '/'))
          }
        }
      }

      // Also check for images in an assets subfolder
      const assetsDir = path.join(dir, 'assets')
      if (fs.existsSync(assetsDir)) {
        const assetFiles = fs.readdirSync(assetsDir)
        for (const file of assetFiles) {
          const ext = path.extname(file).toLowerCase()
          if (imageExtensions.includes(ext)) {
            const relativePath = path.relative(path.resolve(marketingRoot, '..'), path.join(assetsDir, file))
            images.push(relativePath.replace(/\\/g, '/'))
          }
        }
      }

      res.json({ images })
    } catch (err) {
      res.json({ images: [] })
    }
  })

  // Serve an image file
  router.get('/image', (req, res) => {
    const { path: filePath } = req.query

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ error: 'Path required' })
    }

    const fullPath = path.resolve(marketingRoot, '..', filePath)

    if (!fullPath.startsWith(marketingRoot)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const ext = path.extname(fullPath).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
    }

    const mimeType = mimeTypes[ext] || 'application/octet-stream'

    try {
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'Image not found' })
      }

      res.setHeader('Content-Type', mimeType)
      fs.createReadStream(fullPath).pipe(res)
    } catch (err) {
      res.status(500).json({ error: 'Failed to serve image' })
    }
  })

  // Archive file (move to archive folder)
  router.post('/archive', (req, res) => {
    const { path: filePath } = req.body

    if (!filePath) {
      return res.status(400).json({ error: 'Path required' })
    }

    const fullPath = path.resolve(marketingRoot, '..', filePath)

    if (!fullPath.startsWith(marketingRoot)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    try {
      const filename = path.basename(fullPath)
      const datePrefix = new Date().toISOString().split('T')[0]
      const archivePath = path.join(marketingRoot, 'archive', 'content', `${datePrefix}_${filename}`)

      // Ensure archive directory exists
      const archiveDir = path.dirname(archivePath)
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true })
      }

      fs.renameSync(fullPath, archivePath)
      res.json({ success: true, archivedTo: archivePath })
    } catch (err) {
      res.status(500).json({ error: 'Failed to archive file' })
    }
  })

  return router
}
