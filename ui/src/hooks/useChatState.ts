import { useState, useCallback } from 'react'
import type { AllMessage, ChatMessage } from '../lib/sdkTypes'

export interface ChatState {
  messages: AllMessage[]
  isLoading: boolean
  claudeSessionId: string | null
  currentRequestId: string | null
}

export function useChatState() {
  const [messages, setMessages] = useState<AllMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [claudeSessionId, setClaudeSessionId] = useState<string | null>(null)
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null)

  const addMessage = useCallback((msg: AllMessage) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const addMessages = useCallback((msgs: AllMessage[]) => {
    if (msgs.length === 0) return
    setMessages(prev => [...prev, ...msgs])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setClaudeSessionId(null)
  }, [])

  const generateRequestId = useCallback(() => {
    const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setCurrentRequestId(id)
    return id
  }, [])

  const addUserMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      type: 'chat',
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
  }, [addMessage])

  return {
    // State
    messages,
    isLoading,
    claudeSessionId,
    currentRequestId,

    // State setters
    setIsLoading,
    setClaudeSessionId,
    setCurrentRequestId,

    // Actions
    addMessage,
    addMessages,
    addUserMessage,
    clearMessages,
    generateRequestId,
  }
}
