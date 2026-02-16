import type { ResultMessage } from '../../../lib/sdkTypes'

interface ResultCardProps {
  message: ResultMessage
}

export function ResultCard({ message }: ResultCardProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`
  }

  const formatCost = (usd: number) => {
    if (usd < 0.01) return `$${usd.toFixed(4)}`
    return `$${usd.toFixed(2)}`
  }

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-500">
        <span>{formatDuration(message.durationMs)}</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span>{formatCost(message.totalCostUsd)}</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span>{message.usage.inputTokens.toLocaleString()} in / {message.usage.outputTokens.toLocaleString()} out</span>
      </div>
    </div>
  )
}
