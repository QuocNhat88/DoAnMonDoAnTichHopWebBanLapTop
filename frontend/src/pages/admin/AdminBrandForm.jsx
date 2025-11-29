import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  useEffect(() => {
    if (isEditMode) {
      brandApi.get(id).then((res) => {
        const data = res.data || res;
        setFormData({
          name: data.name,
          description: data.description,
          logoUrl: data.logoUrl || "",
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) await brandApi.update(id, formData);
      else await brandApi.add(formData);
      navigate("/admin/brands");
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Sửa Thương hiệu" : "Thêm Thương hiệu"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Tên thương hiệu</label>
          <input
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">
            Logo URL (Link ảnh)
          </label>
          <input
            className="w-full border p-2 rounded"
            value={formData.logoUrl}
            onChange={(e) =>
              setFormData({ ...formData, logoUrl: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold w-full"
        >
          LƯU LẠI
        </button>
      </form>
    </div>
  );
}
export default AdminBrandForm;
