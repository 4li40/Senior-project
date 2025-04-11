import React, { useState, useRef, useEffect } from 'react';
// Import an icon from lucide-react (or any other icon library)
import { MessageSquare, X, Send } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatPopup: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTogglePopup = () => {
    setIsOpen(prev => !prev);
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

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating icon button */}
      <button
        onClick={handleTogglePopup}
        className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>

      {/* Chat popup card */}
      {isOpen && (
        <div
          className="
            fixed bottom-20 right-5 w-80 max-h-[32rem]
            flex flex-col border border-gray-200 bg-white 
            rounded-lg shadow-xl overflow-hidden animate-fadeIn
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
            <span className="font-semibold">Chatbot Assistant</span>
            <button
              onClick={handleTogglePopup}
              className="focus:outline-none flex items-center justify-center rounded-full hover:bg-blue-700 px-2 py-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3 min-h-[300px] flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Welcome to Chatbot Assistant</h3>
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
                      className={`max-w-xs px-4 py-2 rounded-md break-words ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-md bg-gray-200 text-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Invisible element for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <form onSubmit={handleSubmit} className="flex border-t border-gray-200">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className={`px-4 py-2 text-white ${
                loading || !inputValue.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;