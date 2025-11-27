// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import productApi from "../api/productApi";
import { Link, useSearchParams } from "react-router-dom"; // 1. Import useSearchParams

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Lấy keyword từ URL (ví dụ: ?keyword=dell -> keyword = "dell")
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 3. Chuẩn bị tham số để gọi API
        // Nếu có keyword thì gửi { keyword: "dell" }, không thì gửi rỗng {}
        const params = keyword ? { keyword } : {};

        // Gọi API với params
        const response = await productApi.getAll(params);

        // Xử lý dữ liệu trả về (Backend bạn trả về { data: [...] })
        const productList = response.data || response.products || response;
        setProducts(productList);
      } catch (error) {
        console.log("Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    // 4. Khi "keyword" thay đổi (người dùng gõ từ mới), hàm này sẽ chạy lại
    fetchProducts();
  }, [keyword]);

  return (
    <div>
      {/* 5. Hiển thị dòng thông báo nếu đang tìm kiếm */}
      {keyword ? (
        <h2 className="text-2xl font-bold mb-6">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-blue-600">"{keyword}"</span>
        </h2>
      ) : (
        // Nếu không tìm kiếm thì hiện Banner như cũ
        <div className="bg-blue-600 text-white p-10 rounded-lg mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Siêu Sale Laptop</h1>
          <p>Giảm giá lên đến 30% cho các dòng Gaming</p>
        </div>
      )}

      {/* Phần hiển thị danh sách sản phẩm (Giữ nguyên) */}
      {!keyword && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sản phẩm mới nhất
        </h2>
      )}

      {loading ? (
        <p className="text-center py-10">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.thumbnail || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="font-semibold text-lg mb-2 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <div className="text-red-600 font-bold mb-4">
                    {product.price?.toLocaleString("vi-VN")} đ
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
            <div className="col-span-full text-center py-10 text-gray-500">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
