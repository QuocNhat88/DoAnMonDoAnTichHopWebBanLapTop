// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

// 1. Tạo cái Context (cái khung chứa)
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 2. State lưu danh sách giỏ hàng
  // Lấy từ localStorage ra nếu có, nếu không thì là mảng rỗng []
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 3. Mỗi khi cartItems thay đổi, tự động lưu lại vào localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- CÁC HÀM XỬ LÝ LOGIC ---

  // Hàm thêm vào giỏ
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Kiểm tra xem sản phẩm này đã có trong giỏ chưa
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        // Nếu có rồi -> Tăng số lượng lên 1 chứ không thêm dòng mới
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu chưa có -> Thêm mới vào với số lượng là 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    alert("Đã thêm vào giỏ hàng thành công!"); // Thông báo nhẹ
  };

  // Hàm xóa khỏi giỏ
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  // Hàm cập nhật số lượng (Tăng/Giảm)
  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          const newQuantity = item.quantity + amount;
          // Nếu số lượng giảm về 0 thì giữ là 1 (hoặc xóa luôn tùy ý, ở đây mình giữ là 1)
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  // 4. Trả về cái "Két sắt" chứa tất cả dữ liệu và hàm
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
