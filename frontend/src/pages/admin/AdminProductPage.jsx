// src/pages/admin/AdminProductPage.jsx
import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import { Link } from "react-router-dom";

function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll();
      console.log("Dữ liệu admin tải về:", response); // Log ra để kiểm tra

      // Kiểm tra kỹ dữ liệu trước khi set
      const data = response.data || response.products || [];
      setProducts(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      try {
        await productApi.delete(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        alert("Xóa thất bại");
      }
    }
  };

  // --- THÊM: HIỂN THỊ LOADING ---
  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <Link
          to="/admin/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
        >
          + Thêm Mới
        </Link>
      </div>

      {/* --- THÊM: KIỂM TRA MẢNG RỖNG --- */}
      {!products || products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Chưa có sản phẩm nào.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Danh mục</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={p.thumbnail || "https://via.placeholder.com/50"}
                    className="w-10 h-10 object-cover rounded border"
                    alt=""
                  />
                </td>
                <td
                  className="p-3 font-medium max-w-xs truncate"
                  title={p.name}
                >
                  {p.name}
                </td>
                <td className="p-3 text-blue-600 text-sm">
                  {/* Dùng toán tử ?. để không lỗi nếu thiếu category */}
                  {p.category?.name || "Chưa set"}
                </td>
                <td className="p-3 text-red-500 font-bold">
                  {p.price?.toLocaleString()}đ
                </td>
                <td className="p-3 text-center space-x-2">
                  <Link
                    to={`/admin/products/edit/${p._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProductPage;
