import type { ChatMessage } from '../../../lib/sdkTypes'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-amber-500 text-white'
            : 'bg-slate-100 text-slate-900'
        }`}
      >
        <div className={`text-xs font-semibold mb-1.5 ${isUser ? 'text-amber-100' : 'text-slate-500'}`}>
          {isUser ? 'You' : 'Claude'}
        </div>
        <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
          {message.content}
        </pre>
      </div>
    </div>
  )
}
