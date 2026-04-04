// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// 1. Import 2 cái Provider (Kho chứa)
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google"; // <-- THÊM IMPORT GOOGLE

// Lấy Client ID từ file .env (Nhớ thêm VITE_GOOGLE_CLIENT_ID vào .env của frontend nhé)
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Bọc Google Provider ra ngoài cùng */}
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        {/* 2. Bọc AuthProvider ở ngoài cùng để cả web dùng được thông tin User */}
        <AuthProvider>
          {/* Bọc tiếp CartProvider để dùng giỏ hàng */}
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
