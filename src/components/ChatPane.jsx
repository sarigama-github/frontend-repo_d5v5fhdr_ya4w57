import { useEffect, useRef, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ChatPane({ chatId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  const loadMessages = async (id) => {
    if (!id) return
    try {
      const res = await fetch(`${baseUrl}/api/chats/${id}/messages`)
      const data = await res.json()
      setMessages(data)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadMessages(chatId)
  }, [chatId])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || !chatId) return
    setInput('')

    // optimistic append user message
    const tempId = `temp-${Date.now()}`
    const userMsg = { id: tempId, chat_id: chatId, role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])

    try {
      await fetch(`${baseUrl}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: text })
      })
      setLoading(true)
      const res2 = await fetch(`${baseUrl}/api/chats/${chatId}/completion`, { method: 'POST' })
      const assistant = await res2.json()
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: `${tempId}-persisted` } : m).concat(assistant))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {!chatId ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Créez ou sélectionnez une conversation pour commencer.
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`max-w-3xl ${m.role === 'user' ? 'ml-auto' : ''}`}>
                <div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} shadow-sm border border-gray-200 px-4 py-3 rounded-2xl whitespace-pre-wrap`}>{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Assistant est en train d'écrire...</div>}
            <div ref={endRef} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="max-w-3xl mx-auto flex gap-2">
              <textarea
                className="flex-1 resize-none rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
                placeholder="Écrivez votre message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Envoyer</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
