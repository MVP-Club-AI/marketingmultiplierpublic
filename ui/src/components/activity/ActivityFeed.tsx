import { useState, useEffect } from 'react'

interface ActivityFile {
  action: 'added' | 'modified' | 'deleted' | 'renamed'
  path: string
  stage?: string
  type?: string
}

interface Activity {
  id: string
  author: string
  relativeTime: string
  message: string
  files: ActivityFile[]
}

const ACTION_COLORS: Record<string, string> = {
  added: 'text-green-600',
  modified: 'text-blue-600',
  deleted: 'text-red-600',
  renamed: 'text-purple-600',
}

const ACTION_DOTS: Record<string, string> = {
  added: 'bg-green-500',
  modified: 'bg-blue-500',
  deleted: 'bg-red-500',
  renamed: 'bg-purple-500',
}

function getAuthorInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

function getAuthorColor(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('founder-1')) return 'bg-blue-500'
  if (lower.includes('founder-2')) return 'bg-green-500'
  if (lower.includes('founder-3')) return 'bg-purple-500'
  return 'bg-navy-500'
}

function getFileSummary(files: ActivityFile[]): string {
  if (files.length === 1) {
    const f = files[0]
    const filename = f.path.split('/').pop() || f.path
    return `${f.action} ${filename}`
  }
  const actions = new Map<string, number>()
  for (const f of files) {
    actions.set(f.action, (actions.get(f.action) || 0) + 1)
  }
  return Array.from(actions.entries())
    .map(([action, count]) => `${action} ${count} file${count > 1 ? 's' : ''}`)
    .join(', ')
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = () => {
    fetch('/api/activity?limit=20')
      .then(res => res.json())
      .then(data => {
        setActivities(data.activities || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchActivities, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="p-4 text-sm text-navy-400">Loading activity...</div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="p-4 text-sm text-navy-400">No recent activity</div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-navy-100">
        <h3 className="text-sm font-semibold text-navy-700">Recent Activity</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">
          {activities.map(activity => {
            const primaryAction = activity.files[0]?.action || 'modified'

            return (
              <div key={activity.id} className="flex gap-2">
                {/* Author avatar */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 ${getAuthorColor(activity.author)}`}>
                  {getAuthorInitial(activity.author)}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Commit message */}
                  <p className="text-xs text-navy-800 leading-snug">
                    <span className="font-medium">{activity.author.split(' ')[0]}</span>{' '}
                    <span className="text-navy-600">{activity.message}</span>
                  </p>

                  {/* File summary */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${ACTION_DOTS[primaryAction] || 'bg-gray-400'}`} />
                    <span className={`text-[10px] ${ACTION_COLORS[primaryAction] || 'text-gray-500'}`}>
                      {getFileSummary(activity.files)}
                    </span>
                  </div>

                  {/* Time */}
                  <p className="text-[10px] text-navy-400 mt-0.5">
                    {activity.relativeTime}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
