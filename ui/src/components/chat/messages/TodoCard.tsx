import type { TodoMessage, TodoItem } from '../../../lib/sdkTypes'

interface TodoCardProps {
  message: TodoMessage
}

function getStatusIcon(status: TodoItem['status']) {
  switch (status) {
    case 'completed':
      return { icon: '✓', color: 'text-green-600 bg-green-100' }
    case 'in_progress':
      return { icon: '→', color: 'text-blue-600 bg-blue-100' }
    case 'pending':
    default:
      return { icon: '○', color: 'text-slate-400 bg-slate-100' }
  }
}

export function TodoCard({ message }: TodoCardProps) {
  const completed = message.todos.filter(t => t.status === 'completed').length
  const total = message.todos.length

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs">
          ☑
        </span>
        <span className="font-medium text-amber-800 text-sm">Tasks</span>
        <span className="text-amber-600 text-xs">{completed}/{total} done</span>
      </div>

      <div className="space-y-1.5">
        {message.todos.map((todo, index) => {
          const status = getStatusIcon(todo.status)
          return (
            <div key={index} className="flex items-start gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${status.color}`}>
                {status.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${
                  todo.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'
                }`}>
                  {todo.content}
                </div>
                {todo.status === 'in_progress' && todo.activeForm && (
                  <div className="text-xs text-blue-500 italic mt-0.5">
                    {todo.activeForm}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
