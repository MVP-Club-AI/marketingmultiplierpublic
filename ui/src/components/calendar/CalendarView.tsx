import { useState, useEffect, useCallback } from 'react'
import { CalendarEntry, ContentLogEntry, Founder } from '../../lib/types'
import { CalendarDay } from './CalendarDay'
import { CalendarEntryForm } from './CalendarEntryForm'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getMonthDates(year: number, month: number): { date: string; isCurrentMonth: boolean }[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const dates: { date: string; isCurrentMonth: boolean }[] = []

  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    dates.push({ date: formatDate(d), isCurrentMonth: false })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    dates.push({ date: formatDate(new Date(year, month, d)), isCurrentMonth: true })
  }

  // Next month padding (fill to complete last week)
  const remaining = 7 - (dates.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      dates.push({ date: formatDate(new Date(year, month + 1, d)), isCurrentMonth: false })
    }
  }

  return dates
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getToday(): string {
  return formatDate(new Date())
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function CalendarView() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [entries, setEntries] = useState<CalendarEntry[]>([])
  const [logEntries, setLogEntries] = useState<ContentLogEntry[]>([])
  const [founderFilter, setFounderFilter] = useState<Founder | 'all'>('all')
  const [showForm, setShowForm] = useState<{ date: string; entry?: CalendarEntry } | null>(null)
  const [loading, setLoading] = useState(true)

  const today = getToday()
  const dates = getMonthDates(year, month)

  // Calculate date range for the visible grid (includes padding days)
  const startDate = dates[0]?.date
  const endDate = dates[dates.length - 1]?.date

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return
    setLoading(true)

    try {
      const [scheduleRes, logRes] = await Promise.all([
        fetch(`/api/calendar?start=${startDate}&end=${endDate}`),
        fetch(`/api/calendar/log?start=${startDate}&end=${endDate}`),
      ])

      const scheduleData = await scheduleRes.json()
      const logData = await logRes.json()

      setEntries(scheduleData.entries || [])
      setLogEntries(logData.entries || [])
    } catch (err) {
      console.error('Failed to load calendar data:', err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }

  const goToToday = () => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }

  const handleSaveEntry = (entry: CalendarEntry) => {
    setEntries(prev => {
      const existing = prev.findIndex(e => e.id === entry.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = entry
        return updated
      }
      return [...prev, entry]
    })
    setShowForm(null)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    setShowForm(null)
  }

  // Filter entries
  const filteredEntries = founderFilter === 'all'
    ? entries
    : entries.filter(e => e.founder === founderFilter)

  const filteredLogEntries = founderFilter === 'all'
    ? logEntries
    : logEntries.filter(e => e.founder.toLowerCase() === founderFilter)

  // Group entries by date for lookup
  const entriesByDate = new Map<string, CalendarEntry[]>()
  for (const entry of filteredEntries) {
    const list = entriesByDate.get(entry.date) || []
    list.push(entry)
    entriesByDate.set(entry.date, list)
  }

  const logEntriesByDate = new Map<string, ContentLogEntry[]>()
  for (const entry of filteredLogEntries) {
    const list = logEntriesByDate.get(entry.date) || []
    list.push(entry)
    logEntriesByDate.set(entry.date, list)
  }

  // Remove log entries that overlap with schedule entries (avoid duplicates)
  for (const [date, logs] of logEntriesByDate) {
    const scheduled = entriesByDate.get(date) || []
    const filtered = logs.filter(log => {
      return !scheduled.some(s => s.status === 'posted' && s.type === (
        log.channel === 'LinkedIn' ? 'linkedin' :
        log.channel === 'Blog' ? 'blog' :
        log.channel === 'Newsletter' ? 'newsletter' :
        log.channel === 'Community' ? 'community' : ''
      ) && s.founder === log.founder.toLowerCase())
    })
    logEntriesByDate.set(date, filtered)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-navy-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-xl font-semibold text-navy-900">
            {MONTH_NAMES[month]} {year}
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevMonth}
              className="px-2 py-1 text-sm text-navy-600 hover:bg-navy-50 rounded transition"
            >
              &#8592;
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-navy-600 hover:bg-navy-50 rounded border border-navy-200 transition"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="px-2 py-1 text-sm text-navy-600 hover:bg-navy-50 rounded transition"
            >
              &#8594;
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="hidden lg:flex items-center gap-2 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">LinkedIn</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Blog</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">Newsletter</span>
            <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">Community</span>
          </div>

          {/* Founder filter */}
          <select
            value={founderFilter}
            onChange={e => setFounderFilter(e.target.value as Founder | 'all')}
            className="text-sm border border-navy-200 rounded px-2 py-1"
          >
            <option value="all">All Founders</option>
            <option value="founder-1">Founder 1</option>
            <option value="founder-2">Founder 2</option>
            <option value="founder-3">Founder 3</option>
            <option value="company">Company</option>
          </select>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-navy-200 bg-navy-50">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="px-2 py-2 text-xs font-semibold text-navy-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Date cells */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-navy-400">Loading calendar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 flex-1">
            {dates.map(({ date, isCurrentMonth }) => (
              <CalendarDay
                key={date}
                date={date}
                isCurrentMonth={isCurrentMonth}
                isToday={date === today}
                entries={entriesByDate.get(date) || []}
                logEntries={logEntriesByDate.get(date) || []}
                onAddEntry={(d) => setShowForm({ date: d })}
                onEditEntry={(entry) => setShowForm({ date: entry.date, entry })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Entry form modal */}
      {showForm && (
        <CalendarEntryForm
          date={showForm.date}
          entry={showForm.entry}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
          onClose={() => setShowForm(null)}
        />
      )}
    </div>
  )
}
