import { useState } from 'react'
import { CalendarEntry, ContentType, Founder, CalendarEntryStatus } from '../../lib/types'

interface CalendarEntryFormProps {
  date: string
  entry?: CalendarEntry
  onSave: (entry: CalendarEntry) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'blog', label: 'Blog' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'community', label: 'Community' },
  { value: 'graphics', label: 'Graphics' },
]

const FOUNDERS: { value: Founder; label: string }[] = [
  { value: 'founder-1', label: 'Founder 1' },
  { value: 'founder-2', label: 'Founder 2' },
  { value: 'founder-3', label: 'Founder 3' },
  { value: 'company', label: 'Company' },
]

const STATUSES: { value: CalendarEntryStatus; label: string }[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'ready', label: 'Ready' },
  { value: 'posted', label: 'Posted' },
]

export function CalendarEntryForm({ date, entry, onSave, onDelete, onClose }: CalendarEntryFormProps) {
  const [formDate, setFormDate] = useState(entry?.date || date)
  const [founder, setFounder] = useState<Founder>(entry?.founder || 'founder-1')
  const [type, setType] = useState<ContentType>(entry?.type || 'linkedin')
  const [title, setTitle] = useState(entry?.title || '')
  const [status, setStatus] = useState<CalendarEntryStatus>(entry?.status || 'planned')
  const [notes, setNotes] = useState(entry?.notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!entry

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (isEditing) {
        const res = await fetch(`/api/calendar/entry/${entry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: formDate, founder, type, title: title.trim(), status, notes }),
        })
        const data = await res.json()
        if (data.success) {
          onSave(data.entry)
        } else {
          setError(data.error || 'Failed to update')
        }
      } else {
        const res = await fetch('/api/calendar/entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: formDate, founder, type, title: title.trim(), notes }),
        })
        const data = await res.json()
        if (data.success) {
          onSave(data.entry)
        } else {
          setError(data.error || 'Failed to create')
        }
      }
    } catch {
      setError('Request failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!entry || !onDelete) return
    if (!confirm('Delete this calendar entry?')) return

    try {
      const res = await fetch(`/api/calendar/entry/${entry.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        onDelete(entry.id)
      }
    } catch {
      setError('Failed to delete')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-navy-100">
          <h2 className="font-headline text-lg font-semibold text-navy-900">
            {isEditing ? 'Edit Entry' : 'Add to Calendar'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Date</label>
            <input
              type="date"
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              className="w-full border border-navy-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Founder</label>
              <select
                value={founder}
                onChange={e => setFounder(e.target.value as Founder)}
                className="w-full border border-navy-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              >
                {FOUNDERS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ContentType)}
                className="w-full border border-navy-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              >
                {CONTENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What are you posting?"
              className="w-full border border-navy-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              autoFocus
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as CalendarEntryStatus)}
                className="w-full border border-navy-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Any additional context..."
              className="w-full border border-navy-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>

          {entry?.filePath && (
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Linked File</label>
              <p className="text-xs text-navy-500 font-mono bg-navy-50 px-3 py-2 rounded">
                {entry.filePath}
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 rounded transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="px-4 py-2 text-sm bg-amber text-white rounded font-medium hover:bg-amber-600 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
