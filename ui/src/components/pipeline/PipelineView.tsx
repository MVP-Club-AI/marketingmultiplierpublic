import { useState, useEffect } from 'react'
import { ContentFile } from '../../lib/types'
import { ContentCard } from './ContentCard'
import { ContentEditor } from './ContentEditor'
import { useWebSocket } from '../../contexts/WebSocketContext'

const STAGES = ['to-review', 'to-post', 'posted'] as const

export function PipelineView() {
  const [files, setFiles] = useState<ContentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<ContentFile | null>(null)
  const [filter, setFilter] = useState<{ founder?: string; type?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const { ws } = useWebSocket()

  // Load pipeline files
  useEffect(() => {
    fetch('/api/pipeline')
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load pipeline:', err)
        setError('Failed to load pipeline')
        setLoading(false)
      })
  }, [])

  // Subscribe to WebSocket updates for real-time sync
  useEffect(() => {
    if (!ws) return

    ws.send(JSON.stringify({ type: 'subscribe-pipeline' }))

    const handler = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data)
        switch (msg.type) {
          case 'pipeline-update':
            setFiles(msg.files || [])
            break
          case 'content-added':
            setFiles(prev => {
              if (prev.some(f => f.path === msg.file.path)) return prev
              return [...prev, msg.file]
            })
            break
          case 'content-moved':
            setFiles(prev => prev.map(f =>
              f.path === msg.file.path ? { ...msg.file, stage: msg.to } : f
            ))
            break
        }
      } catch {
        // Ignore parse errors
      }
    }

    ws.addEventListener('message', handler)
    return () => ws.removeEventListener('message', handler)
  }, [ws])

  const moveFile = async (file: ContentFile, toStage: typeof STAGES[number]) => {
    try {
      const res = await fetch('/api/pipeline/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path, toStage }),
      })
      const data = await res.json()
      if (data.success) {
        setFiles(prev =>
          prev.map(f =>
            f.path === file.path ? { ...f, path: data.newPath, stage: toStage } : f
          )
        )
      }
    } catch (err) {
      setError(`Failed to move file: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const deleteFile = async (file: ContentFile) => {
    if (!confirm(`Delete ${file.path.split('/').pop()}?`)) return

    try {
      const res = await fetch('/api/pipeline/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path }),
      })
      const data = await res.json()
      if (data.success) {
        setFiles(prev => prev.filter(f => f.path !== file.path))
      } else {
        setError(`Failed to delete file: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setError(`Failed to delete file: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const filteredFiles = files.filter(f => {
    if (filter.founder && f.founder !== filter.founder) return false
    if (filter.type && f.type !== filter.type) return false
    return true
  })

  const founders = [...new Set(files.map(f => f.founder).filter(Boolean))]
  const types = [...new Set(files.map(f => f.type))]

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-navy-400">Loading pipeline...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-3 flex justify-between items-center">
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-sm font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b border-navy-100 px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-navy-500">Founder:</label>
          <select
            value={filter.founder || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, founder: e.target.value || undefined }))}
            className="text-sm border border-navy-200 rounded px-2 py-1"
          >
            <option value="">All</option>
            {founders.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-navy-500">Type:</label>
          <select
            value={filter.type || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value || undefined }))}
            className="text-sm border border-navy-200 rounded px-2 py-1"
          >
            <option value="">All</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-sm text-navy-400">
          {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 flex overflow-hidden">
        {STAGES.map(stage => {
          const stageFiles = filteredFiles.filter(f => f.stage === stage)
          return (
            <div
              key={stage}
              className="flex-1 flex flex-col border-r border-navy-100 last:border-r-0"
            >
              <div className="bg-navy-50 px-4 py-3 border-b border-navy-100">
                <h2 className="font-semibold text-navy-700 capitalize">
                  {stage.replace('-', ' ')}
                  <span className="ml-2 text-sm font-normal text-navy-400">
                    ({stageFiles.length})
                  </span>
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {stageFiles.map(file => (
                  <ContentCard
                    key={file.path}
                    file={file}
                    onClick={() => setSelectedFile(file)}
                    onMove={(toStage) => moveFile(file, toStage)}
                    onDelete={() => deleteFile(file)}
                    currentStage={stage}
                  />
                ))}
                {stageFiles.length === 0 && (
                  <p className="text-sm text-navy-300 text-center py-8">
                    No files
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Editor modal */}
      {selectedFile && (
        <ContentEditor
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onSave={(content) => {
            // Handle save
            console.log('Save:', selectedFile.path, content)
            setSelectedFile(null)
          }}
        />
      )}
    </div>
  )
}
