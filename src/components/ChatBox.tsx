'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, FileText, FileImage, File } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://15.207.108.190';

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMsg: Message = { 
      role: 'user', 
      content: userMessage, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('${API_URL}/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const botMsg: Message = { 
        role: 'bot', 
        content: data.reply || 'No response received', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg: Message = { 
        role: 'bot', 
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
      setError('Server is not responding, wait till reconnecting..');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleFileUpload = (file: File, type: string) => {
    console.log(`File uploaded: ${file.name}, type: ${type}`);
    // TODO: Implement file upload functionality
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-orange-100 dark:border-brand-900/40 bg-white dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white sr-only">Agent Inax</h2>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Container - Takes remaining space */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-2 text-sm scrollbar-thin scrollbar-thumb-orange-200 dark:scrollbar-thumb-brand-800">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-3">
            <div className=" p-4 bg-white shadow-lg shadow-orange-200/60">
              <Image src="/inax.png" alt="Inax" width={96} height={96} className='rounded-fulll' priority />
            </div>
            </div>
            <p className="text-2xl font-semibold">Inax</p>
            <p className="text-sm text-brand-700 dark:text-brand-300">tech, simplified</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'bot'
                  ? 'bg-orange-50 dark:bg-neutral-800 text-black dark:text-white'
                  : 'bg-brand-600 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs opacity-70">
                  {msg.role === 'bot' ? 'AI Assistant' : 'You'}
                </span>
                <span className="text-xs opacity-50">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({ inline, children, ...props }: any) {
                      return !inline ? (
                        <pre className="bg-neutral-900 text-white p-3 rounded overflow-x-auto text-xs">
                          <code {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-orange-100 dark:bg-neutral-700 px-1 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-orange-50 dark:bg-neutral-800 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs opacity-70">AI Assistant</span>
                <span className="text-xs opacity-50">typing...</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Fixed Input at Bottom */}
      <div className="border-t border-orange-100 dark:border-brand-900/40 bg-white dark:bg-neutral-900 p-4 pb-8">
        <form onSubmit={handleSubmit} className="flex space-x-2 items-center relative">
        {/* Attach Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="p-3 rounded-full bg-orange-50 dark:bg-neutral-800 hover:bg-orange-100 dark:hover:bg-neutral-700 transition border border-orange-100 dark:border-brand-900/40"
          >
            <Paperclip className="w-5 h-5 text-brand-600 dark:text-brand-300" />
          </button>


          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -10 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-36 left-0 flex flex-col items-center gap-3"
              >
                <button type="button" className="w-32 px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 shadow-sm flex items-center gap-2 border border-orange-100 dark:border-brand-900/40 hover:bg-orange-50 dark:hover:bg-neutral-800" onClick={() => alert('Attach DOCX')}>
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span className="text-xs">DOCX</span>
                  <input
                  type='file'
                  accept='.doc,.docx'
                  className='hidden'
                  onChange={(e)=> {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("DOCX File:", file);
                      handleFileUpload(file, 'docx');
                    }
                  }}
                  />
                </button>

                <button type="button" className="w-32 px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 shadow-sm flex items-center gap-2 border border-orange-100 dark:border-brand-900/40 hover:bg-orange-50 dark:hover:bg-neutral-800" onClick={() => alert('Attach PDF')}>
                  <File className="w-4 h-4 text-brand-600" />
                  <span className="text-xs">PDF</span>
                  <input
                  type='file'
                  accept='application/pdf'
                  className='hidden'
                  onChange={(e)=> {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("DOCX File:", file);
                      handleFileUpload(file, 'docx');
                    }
                  }}
                  />
                </button>
                <button type="button" className="w-32 px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 shadow-sm flex items-center gap-2 border border-orange-100 dark:border-brand-900/40 hover:bg-orange-50 dark:hover:bg-neutral-800" onClick={() => alert('Attach Image')}>
                  <FileImage className="w-4 h-4 text-brand-600" />
                  <span className="text-xs">JPG/PNG</span>
                  <input
                  type='file'
                  accept='image/jpeg,image/png'
                  className='hidden'
                  onChange={(e)=> {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("DOCX File:", file);
                      handleFileUpload(file, 'docx');
                    }
                  }}
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          className="flex-1 p-3 rounded-lg bg-orange-50 dark:bg-neutral-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-orange-100 dark:border-brand-900/40 focus:ring-2 focus:ring-brand-500 outline-none transition-all min-w-0"
          type="text"
          placeholder="Ask AI anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        {/* Send */}
        <button
          className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          type="submit"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            'Send'
          )}
        </button>
        </form>
        
        {/* Disclaimer Message */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AI models can make mistakes, check for important info
          </p>
        </div>
      </div>
    </div>
  );
}