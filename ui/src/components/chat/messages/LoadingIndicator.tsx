export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-100 rounded-lg px-4 py-3 max-w-[85%]">
        <div className="text-xs font-semibold text-slate-500 mb-1.5">Claude</div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span className="animate-pulse">Thinking...</span>
        </div>
      </div>
    </div>
  )
}
