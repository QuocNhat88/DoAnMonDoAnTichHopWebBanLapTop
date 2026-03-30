// src/pages/admin/AdminBrandForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import brandApi from "../../api/brandApi";

function AdminBrandForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      brandApi
        .get(id)
        .then((res) => {
          const data = res.data || res;
          setFormData({
            name: data.name || "",
            description: data.description || "",
            logoUrl: data.logoUrl || "",
          });
        })
        .catch((err) => {
          console.error("Lỗi lấy thương hiệu:", err);
          alert("Không tìm thấy dữ liệu thương hiệu!");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) await brandApi.update(id, formData);
      else await brandApi.add(formData);
      navigate("/admin/brands");
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link
              to="/admin/brands"
              className="hover:text-blue-600 transition-colors"
            >
              Thương hiệu
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {isEditMode ? "Chỉnh sửa" : "Thêm mới"}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Cập nhật Thương hiệu" : "Thêm Thương hiệu"}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/brands"
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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Cột Trái: Thông tin chữ */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-6">
              Thông tin cơ bản
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Ví dụ: Dell, Asus, Apple..."
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
                  placeholder="Viết một đoạn ngắn giới thiệu về hãng này..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all custom-scrollbar resize-y"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Logo Preview */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-6">
              Nhận diện thương hiệu
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Link Logo (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  required
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Vùng Preview Ảnh */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 h-40 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
                {formData.logoUrl ? (
                  <>
                    <img
                      src={formData.logoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400 bg-slate-50">
                      <svg
                        className="w-8 h-8 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-center px-2">
                        Link ảnh bị lỗi hoặc không hỗ trợ
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-10 h-10 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Chưa có Logo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminBrandForm;
