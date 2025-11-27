// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import productApi from "../api/productApi";
import { Link } from "react-router-dom";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll();

        // --- ĐOẠN CODE QUAN TRỌNG ĐỂ DEBUG ---
        console.log("1. Dữ liệu thô từ API:", response);

        // Logic kiểm tra dữ liệu thông minh hơn
        let dataToSet = [];

        // Trường hợp 1: Backend trả về mảng trực tiếp [Sp1, Sp2]
        if (Array.isArray(response)) {
          dataToSet = response;
        }
        // Trường hợp 2: Backend trả về Object có chứa mảng { products: [...] }
        else if (response && Array.isArray(response.products)) {
          dataToSet = response.products;
        }
        // Trường hợp 3: Backend trả về Object kiểu khác { data: [...] }
        else if (response && Array.isArray(response.data)) {
          dataToSet = response.data;
        }

        console.log("2. Dữ liệu sau khi xử lý để hiển thị:", dataToSet);

        setProducts(dataToSet);
        setLoading(false);
      } catch (error) {
        console.log("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="bg-blue-600 text-white p-10 rounded-lg mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Siêu Sale Laptop</h1>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Sản phẩm mới nhất
      </h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        // Kiểm tra chắc chắn products có dữ liệu thì mới map
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {/* Xử lý ảnh phòng hờ nếu không có thumbnail */}
                  <img
                    src={product.thumbnail || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">
                    {product.name}
                  </h3>
                  <div className="text-red-600 font-bold mb-4">
                    {/* Xử lý hiển thị giá tiền an toàn */}
                    {product.price
                      ? product.price.toLocaleString("vi-VN")
                      : 0}{" "}
                    đ
                  </div>
                  <Link
                    to={`/products/${product._id}`}
                    className="block w-full text-center bg-gray-900 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              Chưa có sản phẩm nào hoặc lỗi kết nối.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
