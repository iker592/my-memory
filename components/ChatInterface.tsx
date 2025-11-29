'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, Loader2, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import FileExplorer from './FileExplorer';
import { FileTreeNode } from '@/lib/markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  fileTree: FileTreeNode[];
}

export default function ChatInterface({ fileTree }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close sidebar on route change (for mobile)
  const closeSidebar = () => setSidebarOpen(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Get value from form input directly to handle fast typing
    const form = e.target as HTMLFormElement;
    const inputElement = form.querySelector('input[type="text"]') as HTMLInputElement;
    const inputValue = inputElement?.value || input;
    
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    if (inputElement) inputElement.value = '';
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error('Failed to fetch');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        let fullText = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          fullText += chunk;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg.role === 'assistant') {
              return [
                ...newMessages.slice(0, -1),
                { ...lastMsg, content: fullText }
              ];
            }
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-64 md:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Files</h2>
          <button
            onClick={closeSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Files</h2>
        </div>

        <FileExplorer tree={fileTree} onFileClick={closeSidebar} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {hasMessages ? (
          <>
            {/* Mobile header with menu button */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-medium text-gray-900">MemoryBench</span>
            </div>

            {/* Messages view - input at bottom */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-8">
              <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {message.role === 'assistant' ? (
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold mt-3 mb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold mt-2 mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold mt-2 mb-1">{children}</h3>,
                              p: ({ children }) => <p className="mb-2">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 ml-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                              pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded overflow-x-auto mb-2 text-xs">{children}</pre>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input at bottom */}
            <div className="border-t border-gray-200 bg-white px-3 sm:px-4 py-3 sm:py-4">
              <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Empty state - centered input */
          <div className="flex-1 flex flex-col">
            {/* Mobile header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-medium text-gray-900">MemoryBench</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="w-full max-w-2xl text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 sm:mb-8 shadow-lg mx-auto">
                  <span className="text-2xl sm:text-3xl text-white">💭</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Welcome to MemoryBench</h1>
                <p className="text-gray-500 mb-8 sm:mb-10 text-base sm:text-lg px-4">
                  Ask me anything about your notes, or let me help you organize your thoughts.
                </p>
                
                <form onSubmit={handleSubmit} className="w-full px-2 sm:px-0">
                  <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-gray-300 bg-white px-4 sm:px-5 py-3 sm:py-4 shadow-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-4 text-xs sm:text-sm text-gray-400">Powered by Claude AI</p>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
