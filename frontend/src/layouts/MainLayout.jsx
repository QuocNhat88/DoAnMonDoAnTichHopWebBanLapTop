import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    // Thêm bg-slate-50 để nền web có màu xám sáng cực nhẹ, giúp các thẻ trắng nổi bật hơn
    // Thêm text-slate-800 để chuẩn hóa màu chữ toàn trang
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />

      {/* max-w-7xl giúp giới hạn độ rộng tối đa trên màn hình PC siêu to, nhìn gọn gàng hơn */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
