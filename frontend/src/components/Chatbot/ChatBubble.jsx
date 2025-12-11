import React, { useState, useRef, useEffect } from "react";
import chatApi from "../../api/chatApi"; // Import file api ở bước 1

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào! Mình là trợ lý ảo AI. Bạn cần tìm laptop loại nào?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Hiện tin nhắn người dùng
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Gửi sang Python
      const data = await chatApi.sendMessage(userMsg.text);

      // Hiện trả lời của Bot
      const botMsg = {
        sender: "bot",
        text: data.reply,
        products: data.products || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server đang bận, bạn thử lại sau nhé!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Nút tròn mở chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
          {/* Icon Chat */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Khung Chat */}
      {isOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <h3 className="font-bold text-lg">Trợ lý Laptop 🤖</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-500 p-1 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                </div>

                {/* Thẻ sản phẩm gợi ý */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 w-[90%] space-y-2">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex bg-white p-2 rounded-lg border hover:shadow-md cursor-pointer transition"
                      >
                        {prod.image && (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded border mr-2"
                          />
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold truncate text-gray-800">
                            {prod.name}
                          </p>
                          <p className="text-xs text-red-600 font-bold">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(prod.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="text-gray-400 text-xs ml-2 animate-pulse">
                Bot đang trả lời...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập liệu */}
          <div className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
