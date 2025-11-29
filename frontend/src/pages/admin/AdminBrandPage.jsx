import React, { useEffect, useState } from "react";
import brandApi from "../../api/brandApi";
import { Link } from "react-router-dom";

function AdminBrandPage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    brandApi.getAll().then((res) => setBrands(res.data || res));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Xóa thương hiệu này?")) {
      try {
        await brandApi.delete(id);
        setBrands(brands.filter((b) => b._id !== id));
      } catch (error) {
        alert("Xóa thất bại.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý Thương hiệu</h1>
        <Link
          to="/admin/brands/add"
          className="bg-green-600 text-white px-4 py-2 rounded font-bold"
        >
          + Thêm Mới
        </Link>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3">Logo</th>
            <th className="p-3">Tên thương hiệu</th>
            <th className="p-3">Mô tả</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {item.logoUrl && (
                  <img src={item.logoUrl} className="h-8 w-auto" alt="" />
                )}
              </td>
              <td className="p-3 font-medium">{item.name}</td>
              <td className="p-3 text-gray-500">{item.description}</td>
              <td className="p-3 text-center space-x-2">
                <Link
                  to={`/admin/brands/edit/${item._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminBrandPage;
