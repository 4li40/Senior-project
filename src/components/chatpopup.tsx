import React, { useState, useRef, useEffect } from 'react';
// Import an icon from lucide-react (or any other icon library)
import { MessageSquare, X, Send } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatPopupProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Create the user message and update history
    const userMessage: Message = { sender: 'user', text: inputValue };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    // Concatenate the conversation history for context
    const conversationHistory = updatedMessages
      .map(msg => (msg.sender === 'user' ? `User: ${msg.text}` : msg.text))
      .join('\n');

    try {
      const response = await fetch('http://localhost:5003/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: conversationHistory }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }
      // Append the bot's response
      const botMessage: Message = { sender: 'bot', text: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMsg: Message = {
        sender: 'bot',
        text: 'Error: Unable to fetch response.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 max-h-[36rem] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-blue-50 border-b border-gray-200">
        <span className="font-semibold text-blue-800 text-lg tracking-tight">AI Study Buddy</span>
        <button
          onClick={onToggle}
          className="focus:outline-none flex items-center justify-center rounded-full hover:bg-blue-100 px-2 py-1"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-blue-800" />
        </button>
      </div>

      {/* Message area */}
      <div className="flex-1 px-6 py-4 overflow-y-auto bg-white space-y-3 min-h-[300px] flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Welcome to your Study Buddy</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Ask me anything! I'm here to help with your questions and provide information.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl break-words shadow transition-colors duration-200 text-sm font-medium whitespace-pre-wrap ${ // Added whitespace-pre-wrap here
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-blue-900 rounded-bl-sm border border-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-xl bg-gray-100 text-blue-900 border border-gray-200 shadow flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </>
        )}
        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field */}
      <form onSubmit={handleSubmit} className="flex border-t border-gray-200 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent text-blue-900 placeholder-blue-400 text-base"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className={`px-4 py-2 text-white rounded-r-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold ${
            loading || !inputValue.trim()
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatPopup;