import { CalendarEntry, ContentLogEntry } from '../../lib/types'

interface CalendarDayProps {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  entries: CalendarEntry[]
  logEntries: ContentLogEntry[]
  onAddEntry: (date: string) => void
  onEditEntry: (entry: CalendarEntry) => void
}

const TYPE_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-100 text-blue-700',
  blog: 'bg-amber-100 text-amber-700',
  newsletter: 'bg-purple-100 text-purple-700',
  community: 'bg-green-100 text-green-700',
  graphics: 'bg-pink-100 text-pink-700',
}

const FOUNDER_INITIALS: Record<string, string> = {
  'founder-1': 'F1',
  'founder-2': 'F2',
  'founder-3': 'F3',
  company: 'Co',
}

const STATUS_INDICATORS: Record<string, string> = {
  planned: '',
  'in-progress': '~',
  ready: '*',
  posted: '',
}

const CHANNEL_TO_TYPE: Record<string, string> = {
  'LinkedIn': 'linkedin',
  'Blog': 'blog',
  'Newsletter': 'newsletter',
  'Community': 'community',
}

export function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  entries,
  logEntries,
  onAddEntry,
  onEditEntry,
}: CalendarDayProps) {
  const dayNum = parseInt(date.split('-')[2], 10)

  return (
    <div
      className={`min-h-[100px] border-b border-r border-navy-100 p-1 group relative ${
        isCurrentMonth ? 'bg-white' : 'bg-navy-50/50'
      } ${isToday ? 'ring-2 ring-inset ring-amber' : ''}`}
    >
      {/* Day number and add button */}
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium px-1 ${
          isToday ? 'bg-amber text-white rounded-full w-5 h-5 flex items-center justify-center' :
          isCurrentMonth ? 'text-navy-700' : 'text-navy-300'
        }`}>
          {dayNum}
        </span>
        <button
          onClick={() => onAddEntry(date)}
          className="opacity-0 group-hover:opacity-100 text-navy-400 hover:text-amber text-xs w-5 h-5 flex items-center justify-center rounded hover:bg-amber-50 transition"
          title="Add entry"
        >
          +
        </button>
      </div>

      {/* Scheduled entries */}
      <div className="space-y-0.5">
        {entries.map(entry => {
          const color = TYPE_COLORS[entry.type] || 'bg-gray-100 text-gray-700'
          const initial = FOUNDER_INITIALS[entry.founder] || '?'
          const statusMark = STATUS_INDICATORS[entry.status]

          return (
            <button
              key={entry.id}
              onClick={() => onEditEntry(entry)}
              className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 hover:opacity-80 transition ${color}`}
              title={`${entry.founder} - ${entry.title} (${entry.status})`}
            >
              <span className="font-bold shrink-0">{initial}</span>
              <span className="truncate">{statusMark}{entry.title}</span>
              {entry.status === 'posted' && (
                <span className="shrink-0 ml-auto">&#10003;</span>
              )}
            </button>
          )
        })}

        {/* Historical posts from content log (shown greyed with checkmark) */}
        {logEntries.map((log, i) => {
          const logType = CHANNEL_TO_TYPE[log.channel] || 'blog'
          const color = TYPE_COLORS[logType] || 'bg-gray-100 text-gray-700'
          const initial = FOUNDER_INITIALS[log.founder.toLowerCase()] || '?'

          return (
            <div
              key={`log-${i}`}
              className={`w-full px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 opacity-50 ${color}`}
              title={`${log.founder} - ${log.topic} (posted)`}
            >
              <span className="font-bold shrink-0">{initial}</span>
              <span className="truncate">{log.topic}</span>
              <span className="shrink-0 ml-auto">&#10003;</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
