import { ContentFile } from '../../lib/types'

interface ContentCardProps {
  file: ContentFile
  onClick: () => void
  onMove: (stage: 'to-review' | 'to-post' | 'posted') => void
  onDelete: () => void
  currentStage: 'to-review' | 'to-post' | 'posted'
}

const TYPE_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-100 text-blue-700',
  newsletter: 'bg-purple-100 text-purple-700',
  community: 'bg-green-100 text-green-700',
  blog: 'bg-amber-100 text-amber-700',
  graphics: 'bg-pink-100 text-pink-700',
}

export function ContentCard({ file, onClick, onMove, onDelete, currentStage }: ContentCardProps) {
  const filename = file.path.split('/').pop() || ''
  const typeColor = TYPE_COLORS[file.type] || 'bg-gray-100 text-gray-700'

  const nextStage = currentStage === 'to-review' ? 'to-post' : currentStage === 'to-post' ? 'posted' : null
  const prevStage = currentStage === 'posted' ? 'to-post' : currentStage === 'to-post' ? 'to-review' : null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-navy-100 overflow-hidden hover:shadow-md transition">
      <button
        onClick={onClick}
        className="w-full text-left p-3"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeColor}`}>
            {file.type}
          </span>
          {file.founder && (
            <span className="text-xs text-navy-400 capitalize">
              {file.founder}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-navy-800 truncate">
          {file.title || filename}
        </h3>
        {file.pillar && (
          <p className="text-xs text-navy-400 mt-1 truncate">
            {file.pillar}
          </p>
        )}
        {file.date && (
          <p className="text-xs text-navy-300 mt-1">
            {new Date(file.date).toLocaleDateString()}
          </p>
        )}
      </button>

      {/* Actions */}
      <div className="flex border-t border-navy-100">
        {prevStage && (
          <button
            onClick={() => onMove(prevStage)}
            className="flex-1 px-3 py-2 text-xs text-navy-500 hover:bg-navy-50 transition"
          >
            ← {prevStage.replace('-', ' ')}
          </button>
        )}
        {nextStage && (
          <button
            onClick={() => onMove(nextStage)}
            className="flex-1 px-3 py-2 text-xs text-amber font-medium hover:bg-amber-50 transition"
          >
            {nextStage.replace('-', ' ')} →
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
