// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    // Bỏ text-slate-800 ở đây vì các trang con đã tự set màu riêng.
    // Giữ min-h-screen để footer luôn dính dưới đáy.
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
      <Header />

      {/* Bỏ max-w-7xl và px-4 ở đây. 
        Tại sao? Vì mỗi trang con (Home, Product Detail, Cart...) 
        cần có quyền kiểm soát riêng (VD: banner Trang chủ cần tràn viền 100% màn hình). 
      */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
