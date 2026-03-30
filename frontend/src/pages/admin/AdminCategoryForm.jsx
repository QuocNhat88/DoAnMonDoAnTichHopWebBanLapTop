// src/pages/admin/AdminCategoryForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import categoryApi from "../../api/categoryApi";

function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      categoryApi
        .get(id)
        .then((res) => {
          const data = res.data || res;
          setFormData({
            name: data.name || "",
            description: data.description || "",
          });
        })
        .catch((err) => {
          console.error("Lỗi lấy danh mục:", err);
          alert("Không tìm thấy dữ liệu danh mục!");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) await categoryApi.update(id, formData);
      else await categoryApi.add(formData);
      navigate("/admin/categories");
    } catch (error) {
      alert("❌ Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link
              to="/admin/categories"
              className="hover:text-blue-600 transition-colors"
            >
              Danh mục
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {isEditMode ? "Chỉnh sửa" : "Thêm mới"}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Cập nhật Danh mục" : "Thêm Danh mục"}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/categories"
            className="px-6 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 disabled:opacity-70 transition-all flex items-center gap-2"
          >
            {isSaving && (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isEditMode ? "Lưu Thay Đổi" : "Tạo Mới"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Thông tin cơ bản
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Ví dụ: Laptop Gaming, Laptop Văn Phòng..."
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mô tả giới thiệu
              </label>
              <textarea
                rows="5"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả nhóm laptop này dùng để làm gì..."
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all custom-scrollbar resize-y"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminCategoryForm;
