import { Session } from '../../lib/types'

interface SessionListProps {
  sessions: Session[]
  activeSessionId: string | null
  onSelect: (id: string) => void
}

export function SessionList({ sessions, activeSessionId, onSelect }: SessionListProps) {
  // Group sessions by date
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = new Date(session.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(session)
    return acc
  }, {} as Record<string, Session[]>)

  // Sort dates (most recent first)
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    const dateA = new Date(groupedSessions[a][0].createdAt)
    const dateB = new Date(groupedSessions[b][0].createdAt)
    return dateB.getTime() - dateA.getTime()
  })

  if (sessions.length === 0) {
    return (
      <div className="flex-1 p-3">
        <p className="text-sm text-navy-400 text-center">No sessions yet</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {sortedDates.map(date => (
        <div key={date}>
          <div className="px-3 py-2 bg-navy-50">
            <h3 className="text-xs font-semibold text-navy-500">{date}</h3>
          </div>
          <ul>
            {groupedSessions[date].map(session => (
              <li key={session.id}>
                <button
                  onClick={() => onSelect(session.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition ${
                    session.id === activeSessionId
                      ? 'bg-amber/10 text-amber border-l-2 border-amber'
                      : 'hover:bg-navy-50 text-navy-700'
                  }`}
                >
                  <div className="font-medium truncate">{session.name}</div>
                  <div className="text-xs text-navy-400 mt-0.5">
                    {session.contentFiles.length} file{session.contentFiles.length !== 1 ? 's' : ''}
                    {session.status === 'completed' && ' • Completed'}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
