import { useState } from 'react'
import type { ToolResultMessage } from '../../../lib/sdkTypes'

interface ToolResultCardProps {
  message: ToolResultMessage
}

export function ToolResultCard({ message }: ToolResultCardProps) {
  const previewLines = 8
  const lines = message.content.split('\n')
  const hasMore = lines.length > previewLines
  const [expanded, setExpanded] = useState(!hasMore)

  const colorScheme = message.isError
    ? {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'bg-red-500',
        text: 'text-red-800',
        badge: 'text-red-600',
        content: 'bg-red-100 text-red-800',
        hover: 'hover:bg-red-100',
      }
    : {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'bg-emerald-500',
        text: 'text-emerald-800',
        badge: 'text-emerald-600',
        content: 'bg-emerald-100 text-emerald-800',
        hover: 'hover:bg-emerald-100',
      }

  return (
    <div className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 w-full text-left px-3 py-2 ${colorScheme.hover} transition-colors`}
      >
        <span className={`w-5 h-5 ${colorScheme.icon} rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`}>
          {message.isError ? '!' : '✓'}
        </span>
        <span className={`font-medium ${colorScheme.text} text-sm`}>{message.toolName}</span>
        <span className={`${colorScheme.badge} text-xs`}>{message.summary}</span>
        {hasMore && (
          <span className={`${colorScheme.badge} text-xs ml-auto flex-shrink-0`}>
            {expanded ? '−' : `+${lines.length - previewLines} more`}
          </span>
        )}
      </button>
      <div className="px-3 pb-3">
        <pre className={`p-2 ${colorScheme.content} rounded text-xs overflow-x-auto max-h-72 overflow-y-auto`}>
          {expanded ? message.content : lines.slice(0, previewLines).join('\n')}
        </pre>
      </div>
    </div>
  )
}
