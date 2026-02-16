import { createContext, useContext } from 'react'

interface WebSocketContextValue {
  ws: WebSocket | null
  connected: boolean
}

export const WebSocketContext = createContext<WebSocketContextValue>({
  ws: null,
  connected: false,
})

export function useWebSocket() {
  return useContext(WebSocketContext)
}
