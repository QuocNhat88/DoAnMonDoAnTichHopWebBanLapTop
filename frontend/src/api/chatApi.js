import axios from "axios";

// Đường dẫn server Python trên Render
const AI_BASE_URL = "https://ai-server-g53g.onrender.com";

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
