import { useState, useEffect } from 'react'

type ViewMode = 'edit' | 'preview'

export function NewsletterView() {
  const [reflection, setReflection] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [previewHtml, setPreviewHtml] = useState('')
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Generate preview HTML
  const generatePreview = async () => {
    setLoadingPreview(true)
    try {
      const res = await fetch('/api/newsletter/preview-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection, videoUrl, blogs: selectedBlogs }),
      })
      const data = await res.json()
      if (data.html) {
        setPreviewHtml(data.html)
      }
    } catch (err) {
      console.error('Failed to generate preview:', err)
    } finally {
      setLoadingPreview(false)
    }
  }

  // Update preview when switching to preview mode
  useEffect(() => {
    if (viewMode === 'preview') {
      generatePreview()
    }
  }, [viewMode])

  const handleSendTest = async () => {
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch('/api/newsletter/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection, videoUrl, blogs: selectedBlogs }),
      })
      const data = await res.json()
      setSendResult({ success: data.success, message: data.message || 'Test email sent!' })
    } catch (err) {
      setSendResult({ success: false, message: 'Failed to send test email' })
    } finally {
      setSending(false)
    }
  }

  const handleSendAll = async () => {
    if (!confirm('Send newsletter to all subscribers?')) return

    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection, videoUrl, blogs: selectedBlogs }),
      })
      const data = await res.json()
      setSendResult({ success: data.success, message: data.message || 'Newsletter sent!' })
    } catch (err) {
      setSendResult({ success: false, message: 'Failed to send newsletter' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* View mode toggle */}
      <div className="bg-white border-b border-navy-100 px-8 py-3 flex items-center justify-between">
        <h1 className="font-headline text-xl font-semibold text-navy-900">
          Weekly Newsletter
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-4 py-1.5 text-sm rounded transition ${
              viewMode === 'edit'
                ? 'bg-navy-900 text-white'
                : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-1.5 text-sm rounded transition ${
              viewMode === 'preview'
                ? 'bg-navy-900 text-white'
                : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Edit mode */}
      {viewMode === 'edit' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Founder Reflection */}
            <section className="bg-white rounded-lg shadow-sm border border-navy-100 p-6 mb-6">
              <h2 className="font-semibold text-navy-800 mb-4">Founder Reflection</h2>
              <p className="text-sm text-navy-500 mb-3">
                Write this week's personal reflection from a founder. This appears at the top of the newsletter.
              </p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={8}
                className="w-full border border-navy-200 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                placeholder="This week I've been thinking about..."
              />
              <div className="mt-2 text-right">
                <span className="text-xs text-navy-400">{reflection.length} characters</span>
              </div>
            </section>

            {/* Video Link */}
            <section className="bg-white rounded-lg shadow-sm border border-navy-100 p-6 mb-6">
              <h2 className="font-semibold text-navy-800 mb-4">Featured Video</h2>
              <p className="text-sm text-navy-500 mb-3">
                Add a YouTube video URL to feature in the newsletter.
              </p>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full border border-navy-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </section>

            {/* Blog Posts */}
            <section className="bg-white rounded-lg shadow-sm border border-navy-100 p-6 mb-6">
              <h2 className="font-semibold text-navy-800 mb-4">Blog Posts to Include</h2>
              <p className="text-sm text-navy-500 mb-3">
                Select blog posts to feature in this newsletter. (Coming soon - will load from /marketing/posted/blog/)
              </p>
              <div className="border border-dashed border-navy-200 rounded-lg p-8 text-center text-navy-400">
                Blog post selection coming soon
              </div>
            </section>

            {/* Send Result */}
            {sendResult && (
              <div className={`rounded-lg p-4 mb-6 ${sendResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {sendResult.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/newsletter/save-reflection', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content: reflection, founder: 'company' }),
                    })
                    const data = await res.json()
                    if (data.success) {
                      setSendResult({ success: true, message: 'Draft saved!' })
                    } else {
                      setSendResult({ success: false, message: 'Failed to save draft' })
                    }
                  } catch {
                    setSendResult({ success: false, message: 'Failed to save draft' })
                  }
                }}
                className="px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 rounded transition"
              >
                Save Draft
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className="px-4 py-2 text-sm border border-navy-300 text-navy-600 rounded font-medium hover:bg-navy-50 transition"
              >
                Preview
              </button>
              <button
                onClick={handleSendTest}
                disabled={sending}
                className="px-4 py-2 text-sm border border-amber text-amber rounded font-medium hover:bg-amber/10 disabled:opacity-50 transition"
              >
                {sending ? 'Sending...' : 'Send Test'}
              </button>
              <button
                onClick={handleSendAll}
                disabled={sending || !reflection.trim()}
                className="px-6 py-2 text-sm bg-amber text-white rounded font-medium hover:bg-amber/90 disabled:opacity-50 transition"
              >
                {sending ? 'Sending...' : 'Send to All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview mode */}
      {viewMode === 'preview' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          {/* Preview toolbar */}
          <div className="bg-white border-b border-navy-100 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-navy-500">Email Preview</span>
              <button
                onClick={generatePreview}
                disabled={loadingPreview}
                className="text-xs px-3 py-1 bg-navy-100 text-navy-600 rounded hover:bg-navy-200 disabled:opacity-50 transition"
              >
                {loadingPreview ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendTest}
                disabled={sending}
                className="px-4 py-1.5 text-sm border border-amber text-amber rounded font-medium hover:bg-amber/10 disabled:opacity-50 transition"
              >
                {sending ? 'Sending...' : 'Send Test'}
              </button>
              <button
                onClick={handleSendAll}
                disabled={sending || !reflection.trim()}
                className="px-4 py-1.5 text-sm bg-amber text-white rounded font-medium hover:bg-amber/90 disabled:opacity-50 transition"
              >
                {sending ? 'Sending...' : 'Send to All'}
              </button>
            </div>
          </div>

          {/* Send Result in preview mode */}
          {sendResult && (
            <div className={`mx-4 mt-4 rounded-lg p-3 text-sm ${sendResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {sendResult.message}
            </div>
          )}

          {/* Email preview iframe */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="max-w-[650px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              {loadingPreview ? (
                <div className="flex items-center justify-center h-96 text-navy-400">
                  Loading preview...
                </div>
              ) : previewHtml ? (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[800px] border-0"
                  title="Newsletter Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-navy-400">
                  <div className="text-center">
                    <p className="mb-2">No preview available</p>
                    <p className="text-sm">Add content and click Refresh</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
