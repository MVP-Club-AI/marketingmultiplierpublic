import { useState, useEffect } from 'react'
import { ContentFile } from '../../lib/types'

interface ContentEditorProps {
  file: ContentFile
  onClose: () => void
  onSave: (content: string) => void
}

type ViewMode = 'edit' | 'preview' | 'split'

// Simple markdown to HTML converter
function markdownToHtml(md: string): string {
  // First, extract and placeholder fenced code blocks to protect them
  const codeBlocks: string[] = []
  let html = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    const index = codeBlocks.length
    codeBlocks.push(code.trim())
    return `__CODE_BLOCK_${index}__`
  })

  html = html
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber underline">$1</a>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-amber pl-4 italic text-navy-600">$1</blockquote>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-navy-100 px-1 rounded text-sm">$1</code>')
    // Paragraphs (blank lines)
    .replace(/\n\n/g, '</p><p class="mb-3">')
    // Line breaks
    .replace(/\n/g, '<br>')

  // Restore code blocks
  codeBlocks.forEach((code, index) => {
    const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    html = html.replace(
      `__CODE_BLOCK_${index}__`,
      `</p><pre class="bg-navy-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm font-mono">${escapedCode}</code></pre><p class="mb-3">`
    )
  })

  return `<div class="prose"><p class="mb-3">${html}</p></div>`
}

// Parse frontmatter from markdown
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterStr = match[1]
  const body = match[2]

  const frontmatter: Record<string, string> = {}
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
      frontmatter[key] = value
    }
  })

  return { frontmatter, body }
}

export function ContentEditor({ file, onClose, onSave }: ContentEditorProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [associatedImages, setAssociatedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Load file content
  useEffect(() => {
    fetch(`/api/pipeline/read?path=${encodeURIComponent(file.path)}`)
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '')
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load file:', err)
        setLoading(false)
      })

    // Load associated images
    fetch(`/api/pipeline/images?path=${encodeURIComponent(file.path)}`)
      .then(res => res.json())
      .then(data => {
        setAssociatedImages(data.images || [])
      })
      .catch(err => {
        console.error('Failed to load images:', err)
      })
  }, [file.path])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/pipeline/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path, content }),
      })
      const data = await res.json()
      if (data.success) {
        onSave(content)
      }
    } catch (err) {
      console.error('Failed to save file:', err)
    } finally {
      setSaving(false)
    }
  }

  const { frontmatter, body } = parseFrontmatter(content)
  const previewHtml = markdownToHtml(body)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-navy-800 truncate">
              {file.title || file.path.split('/').pop()}
            </h2>
            <p className="text-sm text-navy-400 truncate">{file.path}</p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 mx-4">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-xs rounded transition ${
                viewMode === 'edit' ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs rounded transition ${
                viewMode === 'split' ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs rounded transition ${
                viewMode === 'preview' ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-navy-400 hover:text-navy-600 text-2xl leading-none ml-4"
          >
            &times;
          </button>
        </div>

        {/* Frontmatter display */}
        {Object.keys(frontmatter).length > 0 && (
          <div className="px-6 py-3 bg-navy-50 border-b border-navy-100 flex flex-wrap gap-4">
            {Object.entries(frontmatter).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-navy-500">{key}:</span>{' '}
                <span className="text-navy-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-navy-400">Loading...</p>
            </div>
          ) : (
            <>
              {/* Editor pane */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-navy-100' : 'flex-1'}`}>
                  <div className="px-4 py-2 bg-navy-50 border-b border-navy-100 text-xs text-navy-500 font-medium">
                    MARKDOWN
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full resize-none p-4 font-mono text-sm focus:outline-none"
                    placeholder="Content..."
                    spellCheck={false}
                  />
                </div>
              )}

              {/* Preview pane */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'flex-1'}`}>
                  <div className="px-4 py-2 bg-navy-50 border-b border-navy-100 text-xs text-navy-500 font-medium">
                    PREVIEW
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div
                      className="text-navy-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Associated images */}
        {associatedImages.length > 0 && (
          <div className="border-t border-navy-100">
            <div className="px-6 py-3 bg-navy-50 border-b border-navy-100">
              <h3 className="text-xs text-navy-500 font-semibold">
                ASSOCIATED IMAGES ({associatedImages.length})
              </h3>
            </div>
            <div className="px-6 py-4 flex gap-4 overflow-x-auto">
              {associatedImages.map((imagePath) => (
                <button
                  key={imagePath}
                  onClick={() => setSelectedImage(imagePath)}
                  className="flex-shrink-0 group"
                >
                  <div className="w-32 h-20 bg-navy-100 rounded overflow-hidden border-2 border-transparent group-hover:border-amber transition">
                    <img
                      src={`/api/pipeline/image?path=${encodeURIComponent(imagePath)}`}
                      alt={imagePath.split('/').pop()}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-navy-500 mt-1 truncate max-w-[128px]">
                    {imagePath.split('/').pop()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-navy-100 bg-white">
          <div className="text-sm text-navy-400">
            {content.length} characters • {content.split('\n').length} lines
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-6 py-2 text-sm bg-amber text-white rounded font-medium hover:bg-amber/90 disabled:opacity-50 transition"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Image lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-60"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img
              src={`/api/pipeline/image?path=${encodeURIComponent(selectedImage)}`}
              alt={selectedImage.split('/').pop()}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-center mt-4 text-sm">
              {selectedImage.split('/').pop()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
