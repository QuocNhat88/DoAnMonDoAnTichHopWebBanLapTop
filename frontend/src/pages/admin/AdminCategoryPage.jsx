import React, { useEffect, useState } from "react";
import categoryApi from "../../api/categoryApi";
import { Link } from "react-router-dom";

function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data || response);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Xóa danh mục này?")) {
      try {
        await categoryApi.delete(id);
        setCategories(categories.filter((c) => c._id !== id));
      } catch (error) {
        alert("Xóa thất bại. Có thể danh mục đang chứa sản phẩm.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
        <Link
          to="/admin/categories/add"
          className="bg-green-600 text-white px-4 py-2 rounded font-bold"
        >
          + Thêm Mới
        </Link>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3">Tên danh mục</th>
            <th className="p-3">Mô tả</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{item.name}</td>
              <td className="p-3 text-gray-500">{item.description}</td>
              <td className="p-3 text-center space-x-2">
                <Link
                  to={`/admin/categories/edit/${item._id}`}
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
export default AdminCategoryPage;
