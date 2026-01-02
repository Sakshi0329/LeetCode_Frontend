import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hi, How are you?" }] },
    { role: 'user', parts: [{ text: "I am Good" }] }
  ]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: data.message }] }]);
    reset();

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: messages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode
      });

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response.data.message }] }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Error from AI Chatbot" }] }]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px] border rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] px-4 py-2 rounded-lg shadow 
              ${msg.role === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"}`}>
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="sticky bottom-0 p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 flex items-center space-x-2"
      >
        <input 
          placeholder="Ask me anything..." 
          className={`input flex-1 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2`}
          {...register("message", { required: true, minLength: 2 })}
        />
        <button 
          type="submit" 
          className={`btn btn-primary rounded-lg p-2 ${errors.message ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!!errors.message}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default ChatAi;
