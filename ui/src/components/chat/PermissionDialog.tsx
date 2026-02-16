import { useState } from 'react'

export interface PermissionRequest {
  toolName: string
  toolId: string
  description: string
  filePath?: string
  command?: string
}

interface PermissionDialogProps {
  request: PermissionRequest
  onApprove: (allowAlways: boolean) => void
  onDeny: () => void
}

export function PermissionDialog({ request, onApprove, onDeny }: PermissionDialogProps) {
  const [allowAlways, setAllowAlways] = useState(false)

  const getIcon = () => {
    switch (request.toolName) {
      case 'Write':
      case 'Edit':
        return '📝'
      case 'Bash':
        return '⚡'
      case 'Read':
        return '📖'
      default:
        return '🔧'
    }
  }

  const getActionText = () => {
    switch (request.toolName) {
      case 'Write':
        return 'create/overwrite'
      case 'Edit':
        return 'edit'
      case 'Bash':
        return 'run command'
      case 'Read':
        return 'read'
      default:
        return 'use'
    }
  }

  const getRiskLevel = () => {
    switch (request.toolName) {
      case 'Bash':
        return 'high'
      case 'Write':
      case 'Edit':
        return 'medium'
      default:
        return 'low'
    }
  }

  const riskLevel = getRiskLevel()
  const riskColors = {
    high: 'border-red-300 bg-red-50',
    medium: 'border-amber-300 bg-amber-50',
    low: 'border-blue-300 bg-blue-50',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 border-2 ${riskColors[riskLevel]}`}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getIcon()}</span>
            <h2 className="text-lg font-semibold text-slate-800">
              Permission Required
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <p className="text-slate-700 mb-3">
            Claude wants to <strong>{getActionText()}</strong> using <strong>{request.toolName}</strong>:
          </p>

          {request.filePath && (
            <div className="bg-slate-100 rounded p-3 mb-3 font-mono text-sm break-all">
              {request.filePath}
            </div>
          )}

          {request.command && (
            <div className="bg-slate-800 text-green-400 rounded p-3 mb-3 font-mono text-sm overflow-x-auto">
              $ {request.command}
            </div>
          )}

          {request.description && (
            <p className="text-sm text-slate-500 mb-4">
              {request.description}
            </p>
          )}

          {/* Always allow checkbox */}
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={allowAlways}
              onChange={(e) => setAllowAlways(e.target.checked)}
              className="rounded border-slate-300"
            />
            Always allow <strong>{request.toolName}</strong> for this session
          </label>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onDeny}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition"
          >
            Deny
          </button>
          <button
            onClick={() => onApprove(allowAlways)}
            className={`px-4 py-2 text-white rounded transition ${
              riskLevel === 'high'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  )
}
