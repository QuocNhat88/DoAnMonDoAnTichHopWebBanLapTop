import React, { useState, useRef, useEffect } from "react";
import chatApi from "../../api/chatApi";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào! Mình là trợ lý AI của cửa hàng. Bạn đang tìm laptop văn phòng, đồ họa hay gaming nhỉ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

      // --- ĐOẠN FIX LỖI ĐỌC DỮ LIỆU AI TRẢ VỀ (CẬP NHẬT) ---
      let botReplyText = "";

      if (typeof data.reply === "string") {
        // Trường hợp 1: AI ngoan ngoãn trả về chuỗi bình thường
        botReplyText = data.reply;
      } else if (Array.isArray(data.reply)) {
        // Trường hợp 2 (Của bạn hiện tại): AI trả về một Mảng các Object
        // Ta sẽ duyệt qua mảng, lấy giá trị 'text' của từng phần tử và ghép lại
        botReplyText = data.reply.map((item) => item.text || "").join("\n");
      } else if (data.reply && data.reply.text) {
        // Trường hợp 3: AI trả về 1 Object đơn lẻ
        botReplyText = data.reply.text;
      } else {
        // Trường hợp fallback: Nếu cấu trúc quá lạ
        botReplyText =
          "Xin lỗi, dữ liệu AI trả về hơi lạ nên mình không đọc được.";
        console.log("Cấu trúc AI trả về:", data.reply);
      }

      // Hiện trả lời của Bot
      const botMsg = {
        sender: "bot",
        text: botReplyText, // Dùng đoạn text đã được móc ra sạch sẽ
        products: Array.isArray(data.products) ? data.products : [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Xin lỗi, server đang bận một chút. Bạn thử lại sau vài giây nhé!",
        },
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
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-110 group relative"
        >
          {/* Chấm đỏ thông báo */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
          <svg
            className="h-7 w-7 group-hover:animate-pulse"
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
        <div className="bg-white w-[90vw] sm:w-[380px] h-[550px] max-h-[85vh] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm shadow-inner border border-white/30">
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  Trợ lý Laptop
                </h3>
                <p className="text-[11px] text-blue-100 font-medium">
                  Luôn sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
            {/* Tin nhắn chào mừng hệ thống (Optional) */}
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-200/50 px-2 py-1 rounded-full">
                Hôm nay
              </span>
            </div>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 text-[15px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                {/* Thẻ sản phẩm gợi ý - Thêm Array.isArray để bọc lót */}
                {Array.isArray(msg.products) && msg.products.length > 0 && (
                  <div className="mt-2 w-[85%] space-y-2">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id || prod._id}
                        className="flex items-center bg-white p-2.5 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
                        onClick={() =>
                          window.open(
                            `/products/${prod.id || prod._id}`,
                            "_blank",
                          )
                        }
                      >
                        <div className="w-14 h-14 bg-gray-50 rounded-lg p-1 mr-3 flex-shrink-0">
                          <img
                            src={
                              prod.image ||
                              prod.thumbnail ||
                              "https://via.placeholder.com/150"
                            }
                            alt={prod.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-sm font-bold truncate text-gray-800 group-hover:text-blue-600 transition-colors">
                            {prod.name}
                          </p>
                          <p className="text-sm text-red-600 font-black mt-0.5">
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

            {/* Hiệu ứng Bot đang gõ chữ */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm flex gap-1.5 items-center">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            )}

            {/* Thẻ ẩn để tự động scroll xuống */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Ô nhập liệu */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Hỏi bot về laptop..."
              className="flex-1 max-h-32 min-h-[44px] bg-slate-100 border-transparent rounded-2xl px-4 py-2.5 text-[15px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all resize-none overflow-y-auto custom-scrollbar"
              rows="1"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 flex-shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="h-5 w-5 transform rotate-90 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
