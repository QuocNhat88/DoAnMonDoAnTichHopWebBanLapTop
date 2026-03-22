// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom"; // Thêm Navigate
import { useContext } from "react"; // Thêm useContext
import { AuthContext } from "./context/AuthContext"; // Import AuthContext

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// Pages - Khách hàng
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

// Pages - Admin
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import AdminProductPage from "./pages/admin/AdminProductPage.jsx";
import AdminProductForm from "./pages/admin/AdminProductForm.jsx";
import AdminOrderPage from "./pages/admin/AdminOrderPage.jsx";
import AdminUserPage from "./pages/admin/AdminUserPage.jsx";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage.jsx";
import AdminCategoryForm from "./pages/admin/AdminCategoryForm.jsx";
import AdminBrandPage from "./pages/admin/AdminBrandPage.jsx";
import AdminBrandForm from "./pages/admin/AdminBrandForm.jsx";

import ChatBubble from "./components/Chatbot/ChatBubble.jsx";

// ==========================================
// 👉 ĐÂY LÀ HÀM BẢO VỆ ROUTE MỚI THÊM
// ==========================================
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Tùy chọn: Có thể hiện alert báo lỗi ở đây
    return <Navigate to="/login" replace />;
  }
  return children;
};
// ==========================================

function App() {
  return (
    <>
      <ChatBubble />
      <Routes>
        {/* KHU VỰC KHÁCH HÀNG */}
        <Route path="/" element={<MainLayout />}>
          {/* CÁC ROUTE CÔNG KHAI (AI CŨNG VÀO ĐƯỢC) */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="resetpassword/:token" element={<ResetPasswordPage />} />

          {/* CÁC ROUTE BẢO VỆ (PHẢI ĐĂNG NHẬP) */}
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* KHU VỰC ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<AdminProductPage />} />
          <Route path="products/add" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrderPage />} />
          <Route path="users" element={<AdminUserPage />} />
          <Route path="categories" element={<AdminCategoryPage />} />
          <Route path="categories/add" element={<AdminCategoryForm />} />
          <Route path="categories/edit/:id" element={<AdminCategoryForm />} />
          <Route path="brands" element={<AdminBrandPage />} />
          <Route path="brands/add" element={<AdminBrandForm />} />
          <Route path="brands/edit/:id" element={<AdminBrandForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
