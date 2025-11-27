// src/App.jsx

import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx"; // Import cái khung
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
function App() {
  return (
    // Không cần thẻ div bao ngoài hay nav cũ nữa vì đã có trong Layout
    <Routes>
      {/* Route cha sử dụng MainLayout.
        Tất cả các Route con bên trong sẽ được hiển thị tại vị trí <Outlet /> của MainLayout 
      */}
      <Route path="/" element={<MainLayout />}>
        {/* index: nghĩa là đây là trang mặc định khi vào đường dẫn cha "/" */}
        <Route index element={<HomePage />} />

        {/* Khi vào /login, nó vẫn nằm trong MainLayout nhưng thay thế chỗ của HomePage */}
        <Route path="login" element={<LoginPage />} />

        {/* Sau này bạn thêm trang sản phẩm, giỏ hàng vào đây */}
        {/* <Route path="cart" element={<CartPage />} /> */}
        <Route path="products/:id" element={<ProductDetailPage />} />

        <Route path="cart" element={<CartPage />} />
      </Route>

      {/* Nếu sau này có trang Admin, chúng ta sẽ tạo một Route riêng ở ngoài
        để dùng AdminLayout khác (không chung Header với khách hàng)
      */}
    </Routes>
  );
}

export default App;
