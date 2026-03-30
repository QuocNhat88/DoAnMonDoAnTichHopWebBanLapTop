// src/pages/admin/AdminProductPage.jsx
import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import { Link } from "react-router-dom";

function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { keyword: keyword };
      const response = await productApi.getAll(params);
      const data = response.data || response.products || [];
      setProducts(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("⚠️ Bạn có chắc chắn muốn xóa sản phẩm này vĩnh viễn?")
    ) {
      try {
        await productApi.delete(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        alert("Xóa thất bại: " + error.message);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Kho Sản Phẩm
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý tất cả mặt hàng, giá bán và tồn kho.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 sm:w-80 relative">
            <input
              type="text"
              placeholder="Tìm tên laptop, mã SP..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button type="submit" className="hidden">
              Tìm
            </button>
          </form>

          <Link
            to="/admin/products/add"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all whitespace-nowrap"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        {loading || isSearching ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-sm text-gray-500 font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              {keyword
                ? `Không có kết quả nào phù hợp với từ khóa "${keyword}".`
                : "Kho hàng của bạn đang trống."}
            </p>
            {keyword && (
              <button
                onClick={() => {
                  setKeyword("");
                  setIsSearching(true);
                  fetchProducts();
                }}
                className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Phân loại</th>
                  <th className="px-6 py-4">Tồn kho</th>
                  <th className="px-6 py-4">Giá bán</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const stock = p.stock ?? p.countInStock ?? 0;
                  const isOutOfStock = stock <= 0;

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Cột 1: Ảnh & Tên */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-50 border border-gray-100 rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={
                                p.thumbnail || "https://via.placeholder.com/100"
                              }
                              className="w-full h-full object-contain mix-blend-multiply"
                              alt=""
                            />
                          </div>
                          <div>
                            <div
                              className="font-bold text-gray-900 text-sm max-w-[200px] lg:max-w-[300px] truncate"
                              title={p.name}
                            >
                              {p.name}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              Mã: {p._id?.substring(0, 8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Phân loại & Cấu hình */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold mb-1">
                          {p.category?.name || "Khác"}
                        </div>
                        {p.specifications &&
                          (p.specifications.cpu || p.specifications.ram) && (
                            <div className="text-[11px] text-gray-400 font-medium truncate max-w-[150px]">
                              {p.specifications.cpu} • {p.specifications.ram}
                            </div>
                          )}
                      </td>

                      {/* Cột 3: Tồn kho & Trạng thái */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-sm font-bold text-gray-700">
                            {stock} chiếc
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${isOutOfStock ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                          >
                            {isOutOfStock ? "Hết hàng" : "Đang bán"}
                          </span>
                        </div>
                      </td>

                      {/* Cột 4: Giá */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-gray-900">
                          {p.price?.toLocaleString("vi-VN")} ₫
                        </span>
                      </td>

                      {/* Cột 5: Action */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer bảng (Phân trang - Dựng UI trước, logic ghép sau) */}
      {!loading && products.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <p>
            Hiển thị{" "}
            <span className="font-bold text-gray-900">{products.length}</span>{" "}
            sản phẩm
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
              Trước
            </button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white font-bold">
              1
            </button>
            <button className="px-3 py-1 rounded bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductPage;
