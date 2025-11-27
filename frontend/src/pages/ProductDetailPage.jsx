// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState, useContext } from "react"; // Thêm useContext
import { useParams } from "react-router-dom";
import productApi from "../api/productApi";
import { CartContext } from "../context/CartContext"; // Import Context

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Lấy hàm addToCart từ Context
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // (Phần gọi API giữ nguyên không đổi)
    const fetchProductDetail = async () => {
      try {
        const response = await productApi.get(id);
        setProduct(response.data || response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy!</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-sm">
        {/* Cột Trái (Giữ nguyên) */}
        <div className="flex items-center justify-center bg-gray-50 border rounded-lg p-4">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="max-h-[400px] object-contain"
          />
        </div>

        {/* Cột Phải */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-3xl font-bold text-red-600 mb-6">
            {product.price?.toLocaleString("vi-VN")} đ
          </div>

          <div className="flex gap-4 mb-8">
            {/* 2. Gắn sự kiện onClick vào nút này */}
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
            >
              THÊM VÀO GIỎ
            </button>

            <button className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg">
              ❤️
            </button>
          </div>

          {/* (Phần thông số kỹ thuật giữ nguyên...) */}
          <div className="border-t pt-4">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
