// src/App.jsx
import { Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      {/* KHU VỰC KHÁCH HÀNG */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="my-orders" element={<MyOrdersPage />} />
        <Route path="order/:id" element={<OrderDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="resetpassword/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* KHU VỰC ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Quản lý sản phẩm */}
        <Route path="products" element={<AdminProductPage />} />
        <Route path="products/add" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />

        {/* Quản lý đơn hàng */}
        <Route path="orders" element={<AdminOrderPage />} />

        <Route path="users" element={<AdminUserPage />} />

        {/* Route Danh mục */}
        <Route path="categories" element={<AdminCategoryPage />} />
        <Route path="categories/add" element={<AdminCategoryForm />} />
        <Route path="categories/edit/:id" element={<AdminCategoryForm />} />

        {/* Route Thương hiệu */}
        <Route path="brands" element={<AdminBrandPage />} />
        <Route path="brands/add" element={<AdminBrandForm />} />
        <Route path="brands/edit/:id" element={<AdminBrandForm />} />
      </Route>
    </Routes>
  );
}

export default App;
