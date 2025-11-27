// src/layouts/MainLayout.jsx

// Import Component "Outlet" từ react-router-dom
// Outlet đóng vai trò là cái "lỗ hổng" để nội dung trang con chui vào
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Import Header vừa tạo
import Footer from "../components/Footer"; // Import Footer vừa tạo

function MainLayout() {
  return (
    // min-h-screen: đảm bảo trang web luôn cao ít nhất bằng màn hình
    // flex-col: sắp xếp các phần tử dọc (Header -> Content -> Footer)
    <div className="flex flex-col min-h-screen">
      {/* 1. Header luôn nằm trên cùng */}
      <Header />

      {/* 2. Phần nội dung chính (Main Content) */}
      {/* flex-grow: giúp phần này giãn ra để đẩy Footer xuống đáy nếu nội dung ngắn */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Outlet là nơi code của trang Home, Login... sẽ hiển thị */}
        <Outlet />
      </main>

      {/* 3. Footer luôn nằm dưới cùng */}
      <Footer />
    </div>
  );
}

export default MainLayout;
