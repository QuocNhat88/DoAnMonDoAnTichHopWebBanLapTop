// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import cartApi from "../api/cartApi";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // --- 1. HÀM TẢI GIỎ HÀNG TỪ SERVER ---
  const fetchCart = async () => {
    try {
      const response = await cartApi.getMyCart();
      console.log("Dữ liệu giỏ hàng tải về:", response); // In ra để kiểm tra

      // SỬA LỖI Ở ĐÂY: Backend trả về 'data', không phải 'cart'
      if (response && response.data) {
        const serverCart = response.data.map((item) => ({
          ...item.product, // Lấy thông tin sản phẩm (name, price...)
          quantity: item.quantity,
        }));
        setCartItems(serverCart);
      }
    } catch (error) {
      console.log("Lỗi lấy giỏ hàng:", error);
    }
  };

  // --- 2. TỰ ĐỘNG TẢI KHI CÓ USER ---
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]); // Đăng xuất thì xóa sạch giỏ
    }
  }, [user]);

  // --- 3. HÀM THÊM VÀO GIỎ ---
  const addToCart = async (product) => {
    if (!user) {
      alert("Bạn cần đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    try {
      // Gọi API thêm vào DB
      await cartApi.addToCart({ productId: product._id, quantity: 1 });
      alert("Đã thêm vào giỏ hàng thành công!");

      // Tải lại giỏ hàng để cập nhật danh sách mới
      fetchCart();
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      const msg = error.response?.data?.message || "Lỗi kết nối";
      alert("Không thể thêm vào giỏ: " + msg);
    }
  };

  // --- 4. HÀM SỬA SỐ LƯỢNG ---
  const updateQuantity = async (productId, amount) => {
    if (!user) return;

    const currentItem = cartItems.find((item) => item._id === productId);
    if (!currentItem) return;
    const newQuantity = currentItem.quantity + amount;
    if (newQuantity < 1) return;

    try {
      // SỬA LỖI 2: Backend yêu cầu 'newQuantity', không phải 'quantity'
      await cartApi.updateQuantity({
        productId,
        newQuantity: newQuantity, // <-- Sửa tên biến cho khớp Backend
      });

      // Cập nhật giao diện ngay lập tức (cho mượt)
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.log("Lỗi update số lượng:", error);
      fetchCart(); // Lỗi thì tải lại từ server cho chắc
    }
  };

  // --- 5. HÀM XÓA SẢN PHẨM ---
  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await cartApi.removeFromCart(productId);
      setCartItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.log("Lỗi xóa sản phẩm:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
