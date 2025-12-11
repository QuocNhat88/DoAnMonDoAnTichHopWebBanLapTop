import axios from "axios";

// Đường dẫn server Python bạn vừa chạy xong
const AI_BASE_URL = "http://127.0.0.1:8000";

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
