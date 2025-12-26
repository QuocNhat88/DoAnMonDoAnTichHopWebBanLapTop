import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import { Link } from "react-router-dom";

function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Thêm state cho từ khóa tìm kiếm
  const [keyword, setKeyword] = useState("");

  // 2. Cập nhật hàm fetch để nhận params
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Gửi keyword xuống Backend
      // Backend sẽ nhận: req.query.keyword
      const params = {
        keyword: keyword,
      };

      const response = await productApi.getAll(params);
      console.log("Dữ liệu admin tải về:", response);

      const data = response.data || response.products || [];
      setProducts(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lần đầu khi vào trang (lấy tất cả)
  useEffect(() => {
    fetchProducts();
    // Lưu ý: Không để [keyword] ở đây để tránh gọi API liên tục khi gõ
    // Chúng ta sẽ gọi khi bấm nút "Tìm kiếm"
  }, []);

  // 3. Xử lý khi bấm nút Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault(); // Chặn reload trang
    fetchProducts(); // Gọi lại API với keyword hiện tại
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      try {
        await productApi.delete(id);
        // Xóa thành công thì lọc bỏ khỏi danh sách hiện tại
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        alert("Xóa thất bại: " + error.message);
      }
    }
  };

  if (loading && products.length === 0)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white p-6 rounded shadow min-h-screen">
      {/* --- PHẦN HEADER & TÌM KIẾM --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>

        {/* Form tìm kiếm */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 max-w-md mx-4 gap-2"
        >
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Tìm
          </button>
        </form>

        <Link
          to="/admin/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Thêm Mới
        </Link>
      </div>

      {/* --- PHẦN DANH SÁCH SẢN PHẨM --- */}
      {!products || products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
          {keyword && (
            <button
              onClick={() => {
                setKeyword("");
                fetchProducts();
              }}
              className="mt-2 text-blue-600 hover:underline"
            >
              Xóa bộ lọc để xem tất cả
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-600 uppercase text-sm leading-normal">
                <th className="p-3 text-left">Ảnh</th>
                <th className="p-3 text-left">Tên sản phẩm</th>
                <th className="p-3 text-left">Danh mục</th>
                <th className="p-3 text-left">Cấu hình (CPU/RAM)</th>
                <th className="p-3 text-left">Giá</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    <img
                      src={p.thumbnail || "https://via.placeholder.com/50"}
                      className="w-12 h-12 object-cover rounded border"
                      alt=""
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    <div className="max-w-xs truncate" title={p.name}>
                      {p.name}
                    </div>
                  </td>
                  <td className="p-3 text-blue-600">
                    <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-xs">
                      {p.category?.name || "N/A"}
                    </span>
                  </td>
                  {/* Hiển thị tóm tắt cấu hình nếu có */}
                  <td className="p-3 text-gray-500">
                    {p.specifications ? (
                      <div className="flex flex-col text-xs">
                        <span>{p.specifications.cpu}</span>
                        <span>{p.specifications.ram}</span>
                      </div>
                    ) : (
                      <span className="italic">Chưa có</span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-red-500">
                    {p.price?.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex item-center justify-center gap-2">
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="Sửa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                        className="w-8 h-8 flex items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200"
                        title="Xóa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProductPage;
