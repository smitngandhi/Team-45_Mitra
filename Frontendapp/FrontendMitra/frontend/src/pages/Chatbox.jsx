import { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/api/chat",
        { message: input },
        { withCredentials: true }
      );

      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error sending message", error);
    }

    setInput("");
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded shadow">
      <div className="h-80 overflow-y-auto bg-white p-4 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 ${
              msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black"
            } rounded max-w-xs`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Ask me anything..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
