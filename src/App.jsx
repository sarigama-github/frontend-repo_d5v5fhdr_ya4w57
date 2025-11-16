import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatPane from './components/ChatPane'

function App() {
  const [selectedChatId, setSelectedChatId] = useState(null)

  useEffect(() => {
    // nothing for now
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-gray-200 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600" />
            <h1 className="font-semibold text-gray-800">Assistant IA</h1>
          </div>
          <a href="/test" className="text-sm text-gray-600 hover:text-gray-900">Statut</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-4 px-0 md:px-4 py-4 h-[calc(100vh-60px)]">
        <div className="md:col-span-4 lg:col-span-3 h-full">
          <Sidebar selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
        </div>
        <div className="md:col-span-8 lg:col-span-9 h-full bg-white/60 backdrop-blur rounded-lg border border-gray-200">
          <ChatPane chatId={selectedChatId} />
        </div>
      </main>
    </div>
  )
}

export default App
