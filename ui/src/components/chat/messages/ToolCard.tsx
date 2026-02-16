import { useState } from 'react'
import type { ToolMessage } from '../../../lib/sdkTypes'

interface ToolCardProps {
  message: ToolMessage
}

export function ToolCard({ message }: ToolCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Generate a brief summary of the input
  const getSummary = () => {
    const input = message.input
    if (message.name === 'Read' && input.file_path) {
      return String(input.file_path).split('/').pop() || 'file'
    }
    if (message.name === 'Write' && input.file_path) {
      return String(input.file_path).split('/').pop() || 'file'
    }
    if (message.name === 'Edit' && input.file_path) {
      return String(input.file_path).split('/').pop() || 'file'
    }
    if (message.name === 'Bash' && input.command) {
      const cmd = String(input.command)
      return cmd.length > 40 ? cmd.substring(0, 37) + '...' : cmd
    }
    if (message.name === 'Glob' && input.pattern) {
      return String(input.pattern)
    }
    if (message.name === 'Grep' && input.pattern) {
      return String(input.pattern)
    }
    return null
  }

  const summary = getSummary()

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-emerald-100 transition-colors"
      >
        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
          T
        </span>
        <span className="font-medium text-emerald-800 text-sm">{message.name}</span>
        {summary && (
          <span className="text-emerald-600 text-xs truncate flex-1 font-mono">
            {summary}
          </span>
        )}
        <span className="text-emerald-500 text-xs flex-shrink-0">
          {expanded ? '−' : '+'}
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-3">
          <pre className="p-2 bg-emerald-100 rounded text-xs text-emerald-800 overflow-x-auto max-h-48 overflow-y-auto">
            {JSON.stringify(message.input, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
