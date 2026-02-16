import { Router } from 'express'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

export function createNewsletterRoutes(projectRoot: string): Router {
  const router = Router()

  // Send test email
  router.post('/send-test', async (req, res) => {
    const { reflection, videoUrl, blogs, subject } = req.body

    try {
      // First, save the newsletter content
      const newsletterPath = await saveNewsletterDraft(projectRoot, { reflection, videoUrl, blogs })

      // Run the send-newsletter.js script in test mode
      const result = await runSendScript(projectRoot, {
        mode: '--test',
        subject: subject || 'Weekly Newsletter (TEST)',
        newsletterPath,
      })

      res.json(result)
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message })
    }
  })

  // Send to all subscribers
  router.post('/send', async (req, res) => {
    const { reflection, videoUrl, blogs, subject } = req.body

    if (!subject) {
      return res.status(400).json({ success: false, message: 'Subject required' })
    }

    try {
      // Save the newsletter content
      const newsletterPath = await saveNewsletterDraft(projectRoot, { reflection, videoUrl, blogs })

      // Run the send-newsletter.js script in send mode
      const result = await runSendScript(projectRoot, {
        mode: '--send',
        subject,
        newsletterPath,
      })

      res.json(result)
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message })
    }
  })

  // Preview subscriber count
  router.post('/preview', async (req, res) => {
    const { reflection, videoUrl, blogs, subject } = req.body

    try {
      const newsletterPath = await saveNewsletterDraft(projectRoot, { reflection, videoUrl, blogs })

      const result = await runSendScript(projectRoot, {
        mode: '--preview',
        subject: subject || 'Weekly Newsletter',
        newsletterPath,
      })

      res.json(result)
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message })
    }
  })

  // Get posted blogs for selection
  router.get('/blogs', (req, res) => {
    const blogsDir = path.join(projectRoot, 'marketing', 'posted', 'blog')

    if (!fs.existsSync(blogsDir)) {
      return res.json({ blogs: [] })
    }

    try {
      const files = fs.readdirSync(blogsDir)
        .filter(f => f.endsWith('.md'))
        .map(f => {
          const filePath = path.join(blogsDir, f)
          const content = fs.readFileSync(filePath, 'utf-8')

          // Parse frontmatter for title
          const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m)
          const title = titleMatch ? titleMatch[1] : f.replace('.md', '')

          return { filename: f, title, path: `marketing/posted/blog/${f}` }
        })

      res.json({ blogs: files })
    } catch (err) {
      res.json({ blogs: [] })
    }
  })

  // Generate preview HTML (returns HTML without saving)
  router.post('/preview-html', (req, res) => {
    const { reflection, videoUrl, blogs } = req.body

    try {
      // Generate HTML with a sample greeting for preview
      const html = generateNewsletterHTML({ reflection: reflection || '', videoUrl, blogs })
      // Replace the placeholder with a sample greeting for preview
      const previewHtml = html.replace('{{greeting}}', 'Hi Sarah,')
      res.json({ html: previewHtml })
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message })
    }
  })

  // Save reflection draft
  router.post('/save-reflection', (req, res) => {
    const { content, founder } = req.body
    const dateStr = new Date().toISOString().split('T')[0]
    const filename = `${dateStr}_${founder || 'reflection'}.md`
    const filePath = path.join(projectRoot, 'marketing', 'inputs', 'newsletter', filename)

    try {
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(filePath, content, 'utf-8')
      res.json({ success: true, path: filePath })
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message })
    }
  })

  return router
}

interface NewsletterContent {
  reflection: string
  videoUrl?: string
  blogs?: string[]
}

async function saveNewsletterDraft(projectRoot: string, content: NewsletterContent): Promise<string> {
  const dateStr = new Date().toISOString().split('T')[0]
  const filename = `${dateStr}_newsletter-draft.html`
  const filePath = path.join(projectRoot, 'marketing', 'to-review', 'newsletter', filename)

  // Generate simple HTML newsletter
  const html = generateNewsletterHTML(content)

  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filePath, html, 'utf-8')
  return filePath
}

function generateNewsletterHTML(content: NewsletterContent): string {
  const { reflection, videoUrl } = content

  // Simple HTML template matching brand colors
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Your Company] Weekly</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf5f0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #081f3f 0%, #15465b 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">[Your Company] Weekly</h1>
    </div>

    <!-- Content -->
    <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px;">
      <!-- Greeting -->
      <p style="color: #081f3f; font-size: 16px; line-height: 1.6;">{{greeting}}</p>

      <!-- Founder Reflection -->
      <div style="margin: 24px 0;">
        <h2 style="color: #081f3f; font-size: 18px; margin-bottom: 12px;">This Week's Reflection</h2>
        <div style="color: #333; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(reflection)}</div>
      </div>

      ${videoUrl ? `
      <!-- Video -->
      <div style="margin: 24px 0;">
        <h2 style="color: #081f3f; font-size: 18px; margin-bottom: 12px;">Featured Video</h2>
        <a href="${escapeHtml(videoUrl)}" style="display: block; text-decoration: none;">
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #d97706; margin: 0;">Watch on YouTube →</p>
          </div>
        </a>
      </div>
      ` : ''}

      <!-- CTA -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="[COMMUNITY_URL]" style="display: inline-block; background: #d97706; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600;">Join the Community</a>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 32px; text-align: center;">
        <p style="color: #666; font-size: 13px; margin: 0;">
          Questions? Just reply to this email.<br>
          <a href="[COMMUNITY_URL]" style="color: #d97706;">[Your Company]</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface SendScriptOptions {
  mode: '--test' | '--send' | '--preview'
  subject: string
  newsletterPath: string
}

async function runSendScript(projectRoot: string, options: SendScriptOptions): Promise<{ success: boolean; message: string; output?: string }> {
  return new Promise((resolve) => {
    const scriptPath = path.join(projectRoot, 'scripts', 'send-newsletter.js')

    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      resolve({ success: false, message: 'send-newsletter.js not found' })
      return
    }

    const args = [
      scriptPath,
      options.mode,
      '--subject', options.subject,
      '--newsletter', options.newsletterPath,
    ]

    const proc = spawn('node', args, {
      cwd: projectRoot,
      env: process.env,
    })

    let output = ''
    let errorOutput = ''

    proc.stdout.on('data', (data) => {
      output += data.toString()
    })

    proc.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, message: 'Email sent successfully', output })
      } else {
        resolve({ success: false, message: errorOutput || output || 'Script failed', output })
      }
    })

    proc.on('error', (err) => {
      resolve({ success: false, message: err.message })
    })
  })
}
