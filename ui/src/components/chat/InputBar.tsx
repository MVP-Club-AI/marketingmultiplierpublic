import { useState, useRef, useEffect } from 'react'

interface InputBarProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
  onAbort?: () => void
  prefillValue?: string
  onPrefillConsumed?: () => void
}

export function InputBar({ onSubmit, disabled, isLoading, onAbort, prefillValue, onPrefillConsumed }: InputBarProps) {
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when not loading
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading])

  // Handle prefill value from command buttons
  useEffect(() => {
    if (prefillValue) {
      setValue(prefillValue + ' ')
      inputRef.current?.focus()
      onPrefillConsumed?.()
    }
  }, [prefillValue, onPrefillConsumed])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || disabled || isLoading) return

    onSubmit(value)
    setHistory(prev => [...prev, value])
    setHistoryIndex(-1)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape to abort
    if (e.key === 'Escape' && isLoading && onAbort) {
      e.preventDefault()
      onAbort()
      return
    }

    // History navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setValue(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setValue('')
        } else {
          setHistoryIndex(newIndex)
          setValue(history[newIndex])
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white">
      <div className="flex items-center px-4 py-3 gap-3">
        <span className="text-amber-500 font-mono">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? 'Processing... (Esc to cancel)' : 'Type a message or /command...'}
          disabled={disabled || isLoading}
          className="flex-1 bg-transparent text-slate-900 outline-none placeholder-slate-400 text-sm disabled:opacity-50"
        />
        {isLoading && onAbort ? (
          <button
            type="button"
            onClick={onAbort}
            className="px-4 py-1.5 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!value.trim() || disabled || isLoading}
            className="px-4 py-1.5 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        )}
      </div>
    </form>
  )
}
