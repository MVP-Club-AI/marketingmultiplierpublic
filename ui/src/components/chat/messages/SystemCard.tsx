import { useState } from 'react'
import type { SystemInitMessage } from '../../../lib/sdkTypes'

interface SystemCardProps {
  message: SystemInitMessage
}

export function SystemCard({ message }: SystemCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-blue-100 transition-colors"
      >
        <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
          i
        </span>
        <span className="font-medium text-blue-800 text-sm">Session Started</span>
        <span className="text-blue-600 text-xs">{message.model}</span>
        <span className="text-blue-500 text-xs ml-auto flex-shrink-0">
          {expanded ? '−' : '+'}
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-3">
          <div className="p-2 bg-blue-100 rounded text-xs text-blue-800 space-y-1">
            <div><strong>Model:</strong> {message.model}</div>
            <div><strong>Session:</strong> {message.sessionId.substring(0, 12)}...</div>
            <div><strong>CWD:</strong> {message.cwd}</div>
            <div><strong>Tools:</strong> {message.tools.length} available</div>
          </div>
        </div>
      )}
    </div>
  )
}
