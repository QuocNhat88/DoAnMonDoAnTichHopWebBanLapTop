import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Cấu hình Proxy giả lập Nginx khi chạy dưới máy local (npm run dev)
    proxy: {
      // 1. Nếu Frontend gọi /api -> Vite sẽ chuyển ngầm tới Backend (cổng 3000)
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // 2. Nếu Frontend gọi /ai -> Vite sẽ chuyển ngầm tới AI Server (cổng 8000)
      "/ai": {
        target: "http://localhost:8000",
        changeOrigin: true,
        // Viết lại đường dẫn: Cắt bỏ chữ /ai đi trước khi gửi cho Python
        // Giống hệt cơ chế thêm dấu "/" ở cuối location của Nginx
        rewrite: (path) => path.replace(/^\/ai/, ""),
      },
    },
  },
});
