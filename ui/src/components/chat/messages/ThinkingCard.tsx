import { useState } from 'react'
import type { ThinkingMessage } from '../../../lib/sdkTypes'

interface ThinkingCardProps {
  message: ThinkingMessage
}

export function ThinkingCard({ message }: ThinkingCardProps) {
  const [expanded, setExpanded] = useState(true)
  const lines = message.content.split('\n').length
  const chars = message.content.length

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-purple-100 transition-colors"
      >
        <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
          ?
        </span>
        <span className="font-medium text-purple-800 text-sm">Thinking</span>
        <span className="text-purple-500 text-xs">{lines} lines</span>
        <span className="text-purple-500 text-xs ml-auto flex-shrink-0">
          {expanded ? '−' : '+'}
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-3">
          <pre className="p-2 bg-purple-100 rounded text-sm text-purple-800 whitespace-pre-wrap italic max-h-96 overflow-y-auto">
            {message.content}
          </pre>
        </div>
      )}
    </div>
  )
}
