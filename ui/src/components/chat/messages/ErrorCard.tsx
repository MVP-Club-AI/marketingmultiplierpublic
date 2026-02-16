import type { ErrorMessage } from '../../../lib/sdkTypes'

interface ErrorCardProps {
  message: ErrorMessage
}

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
          !
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-red-800 text-sm">Error</div>
          <pre className="mt-1 text-sm text-red-700 whitespace-pre-wrap">
            {message.message}
          </pre>
        </div>
      </div>
    </div>
  )
}
