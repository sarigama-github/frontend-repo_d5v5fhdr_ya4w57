import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Sidebar({ selectedChatId, onSelectChat }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)

  const loadChats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/chats`)
      const data = await res.json()
      setChats(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChats()
  }, [])

  const createChat = async () => {
    const title = prompt('Titre du nouveau chat') || 'Nouvelle conversation'
    try {
      const res = await fetch(`${baseUrl}/api/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      const data = await res.json()
      await loadChats()
      onSelectChat(data.id)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <aside className="h-full w-full bg-white/70 backdrop-blur border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Conversations</h2>
        <button onClick={createChat} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Nouveau</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && <p className="p-4 text-sm text-gray-500">Chargement...</p>}
        {!loading && chats.length === 0 && (
          <div className="p-4 text-sm text-gray-500">Aucune conversation. Créez-en une.</div>
        )}
        <ul className="p-2 space-y-1">
          {chats.map(c => (
            <li key={c.id}>
              <button
                onClick={() => onSelectChat(c.id)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedChatId === c.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-800'}`}
                title={c.title}
              >
                <span className="line-clamp-1">{c.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
