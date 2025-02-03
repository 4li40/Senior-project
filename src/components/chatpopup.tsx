import React, { useState } from "react";

const ChatWidget = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For chatbot typing animation

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to backend API
      const res = await fetch("http://localhost:5003/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const chatbotResponse = data.response;

      // Add chatbot response to chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: chatbotResponse },
      ]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg border p-4">
      {/* Chat Area */}
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-2">
            <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">
              Typing...
            </span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center">
        <input
          className="flex-1 border rounded-lg p-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send message on Enter key
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
