// src/pages/admin/AdminBrandPage.jsx
import React, { useEffect, useState } from "react";
import brandApi from "../../api/brandApi";
import { Link } from "react-router-dom";

function AdminBrandPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await brandApi.getAll();
        setBrands(res.data || res);
      } catch (error) {
        console.error("Lỗi tải thương hiệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "⚠️ Xóa thương hiệu này có thể ảnh hưởng đến các sản phẩm thuộc về nó. Bạn chắc chắn chứ?",
      )
    ) {
      try {
        await brandApi.delete(id);
        setBrands(brands.filter((b) => b._id !== id));
      } catch (error) {
        alert("Xóa thất bại: " + error.message);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Thương hiệu đối tác
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các hãng laptop đang phân phối.
          </p>
        </div>
        <Link
          to="/admin/brands/add"
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
          Thêm thương hiệu
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Chưa có thương hiệu nào
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Hãy thêm thương hiệu đầu tiên vào hệ thống của bạn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 w-24 text-center">Logo</th>
                  <th className="px-6 py-4 w-1/4">Tên thương hiệu</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4 w-28 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {brands.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 mx-auto bg-white border border-gray-100 rounded-lg p-2 flex items-center justify-center shadow-sm">
                        {item.logoUrl ? (
                          <img
                            src={item.logoUrl}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                            alt={item.name}
                          />
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">
                            No Logo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="line-clamp-2 max-w-md">
                        {item.description || (
                          <span className="italic text-gray-400">
                            Chưa có mô tả
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/brands/edit/${item._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
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
                          onClick={() => handleDelete(item._id)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBrandPage;
