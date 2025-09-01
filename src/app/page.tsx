'use client'

import { ChatInterface } from './components/ChatInterface'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            LLMD Gateway Interface
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chat with your language models through the LLMD gateway
          </p>
        </header>
        
        <ChatInterface />
      </div>
    </div>
  )
}
