import axios from "axios";

// Ưu tiên dùng link Local (nếu có), dự phòng bằng link Render
const AI_BASE_URL =
  import.meta.env.VITE_AI_URL || "https://ai-server-g53g.onrender.com";

const chatApi = {
  sendMessage: async (message) => {
    try {
      const response = await axios.post(`${AI_BASE_URL}/chat`, {
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi chat AI:", error);
      throw error;
    }
  },
};

export default chatApi;
