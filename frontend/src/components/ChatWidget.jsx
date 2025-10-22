import React, { useState, useContext, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ChatWidget = () => {
  const { backendUrl, token, userData } = useContext(AppContext)

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [remainingMessages, setRemainingMessages] = useState(null)

  const chatEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('healthmate-chat-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setChatHistory(parsed.slice(-50)) // Keep last 50 messages
      } catch (error) {
        console.log('Failed to load chat history')
      }
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('healthmate-chat-history', JSON.stringify(chatHistory.slice(-50)))
    }
  }, [chatHistory])

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    if (!token) {
      toast.error('Please login to use the chatbot')
      return
    }

    // Add user message to chat
    const userMessage = { role: 'user', content: message }
    const updatedHistory = [...chatHistory, userMessage]
    setChatHistory(updatedHistory)
    setMessage('')
    setLoading(true)

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/chat',
        {
          message,
          chatHistory: updatedHistory.slice(-10) // Send last 10 messages for context
        },
        { headers: { token } }
      )

      if (data.success) {
        const botMessage = { role: 'assistant', content: data.data.message }
        setChatHistory(prev => [...prev, botMessage])
        setRemainingMessages(data.remainingMessages)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearHistory = () => {
    setChatHistory([])
    localStorage.removeItem('healthmate-chat-history')
    toast.success('Chat history cleared')
  }

  if (!token) {
    return null // Don't show chatbot if user is not logged in
  }

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      {/* Chat Window */}
      {isOpen && (
        <div className='mb-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700'>
          {/* Header */}
          <div className='bg-primary text-white p-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold'>HealthMate Assistant</h3>
                <p className='text-xs opacity-90'>AI-powered health support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='hover:bg-white/20 rounded-full p-2 transition-colors'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900'>
            {chatHistory.length === 0 && (
              <div className='text-center text-gray-500 dark:text-gray-400 mt-20'>
                <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                  </svg>
                </div>
                <p className='font-medium mb-2'>Welcome to HealthMate Assistant!</p>
                <p className='text-sm'>Ask me about your health, medications, or book an appointment.</p>
              </div>
            )}

            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className='text-sm whitespace-pre-wrap'>{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className='flex justify-start'>
                <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className='p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
            {remainingMessages !== null && (
              <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
                {remainingMessages} messages remaining today
              </p>
            )}
            <div className='flex gap-2'>
              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your message...'
                className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white'
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                </svg>
              </button>
            </div>
            {chatHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className='text-xs text-gray-500 dark:text-gray-400 hover:text-primary mt-2'
              >
                Clear chat history
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center hover:scale-110'
      >
        {isOpen ? (
          <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        ) : (
          <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
          </svg>
        )}
      </button>

      {/* Unread indicator (optional, for future enhancement) */}
      {!isOpen && chatHistory.length > 0 && (
        <div className='absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white'></div>
      )}
    </div>
  )
}

export default ChatWidget
