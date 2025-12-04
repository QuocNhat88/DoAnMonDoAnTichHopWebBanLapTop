// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import productApi from "../api/productApi";
import categoryApi from "../api/categoryApi";
import brandApi from "../api/brandApi";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
  });

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryApi.getAll(),
          brandApi.getAll(),
        ]);
        setCategories(catRes.data || catRes);
        setBrands(brandRes.data || brandRes);
      } catch (error) {
        console.log("Lỗi tải metadata:", error);
      }
    };
    fetchMetaData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          keyword: keyword || "",
          category: filter.category,
          brand: filter.brand,
          minPrice: filter.minPrice,
          maxPrice: filter.maxPrice,
        };
        const response = await productApi.getAll(params);
        setProducts(response.data || response.products || []);
        setVisibleCount(12);
      } catch (error) {
        console.log("Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const topCategories = categories.slice(0, 6);
  const featuredBrands = brands.slice(0, 5);

  // Component Card (Giữ nguyên cho đẹp)
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 p-4 flex items-center justify-center bg-gray-50 overflow-hidden rounded-t-lg">
        <img
          src={product.thumbnail || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -15%
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1 uppercase font-semibold tracking-wider">
          {product.brand?.name}
        </div>
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm h-10 group-hover:text-blue-600">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-3">
            <span className="text-lg font-bold text-red-600">
              {product.price?.toLocaleString("vi-VN")} đ
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through mb-1">
                {product.originalPrice?.toLocaleString("vi-VN")} đ
              </span>
            )}
          </div>
          <Link
            to={`/products/${product._id}`}
            className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-bold hover:bg-blue-600 hover:text-white transition"
          >
            Mua Ngay
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {!keyword && (
        <section className="bg-white">
          <div className="container mx-auto px-4 pt-8 pb-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-4">
                  Mừng Lễ Giáng Sinh · Giảm đến 40%
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                  Laptop chính hãng cho làm việc, học tập và gaming
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Đặt hàng online giao nhanh trong 2h, hỗ trợ đổi trả 7 ngày và
                  bảo hành tận nhà toàn quốc.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() =>
                      document
                        .getElementById("shop-section")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-500 transition"
                  >
                    Xem ưu đãi hôm nay
                  </button>
                  <button className="px-8 py-3 rounded-full border border-gray-200 font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition">
                    Tư vấn miễn phí
                  </button>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {products.length || 250}+
                    </p>
                    <p>mẫu laptop</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                    <p>Hỗ trợ kỹ thuật</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                    <p>Điểm đánh giá</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 blur-3xl opacity-30"></div>
                <div className="relative bg-gray-900 rounded-3xl p-6 shadow-2xl">
                  <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
                      alt="Laptop showroom"
                      className="w-full h-72 object-cover opacity-90"
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-xs uppercase text-blue-200">
                        Đổi trả 7 ngày
                      </p>
                      <p className="text-xl font-semibold">Miễn phí</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-xs uppercase text-blue-200">
                        Giao hàng
                      </p>
                      <p className="text-xl font-semibold">2 giờ</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-xs uppercase text-blue-200">
                        Trả góp linh hoạt
                      </p>
                      <p className="text-xl font-semibold">0% lãi</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-xs uppercase text-blue-200">
                        Bảo hành tận nơi
                      </p>
                      <p className="text-xl font-semibold">36 tháng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!keyword && topCategories.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs uppercase text-blue-500 font-semibold">
                Mua theo nhu cầu
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Danh mục nổi bật
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topCategories.map((cat) => (
              <button
                key={cat._id}
                onClick={() =>
                  setFilter((prev) => ({ ...prev, category: cat._id }))
                }
                className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:border-blue-500 hover:shadow-lg transition"
              >
                <div className="text-left">
                  <p className="text-xs uppercase text-gray-400">
                    {cat.productsCount || "Phổ biến"}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {cat.name}
                  </p>
                </div>
                <span className="text-blue-500 text-2xl">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!keyword && featuredBrands.length > 0 && (
        <section className="container mx-auto px-4 pb-8">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase text-blue-500 font-semibold">
                  Thương hiệu được yêu thích
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  Chính hãng 100%, hỗ trợ bảo hành toàn quốc
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Chạm để lọc nhanh theo thương hiệu
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {featuredBrands.map((brand) => (
                <button
                  key={brand._id}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, brand: brand._id }))
                  }
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                    filter.brand === brand._id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        id="shop-section"
        className="container mx-auto px-4 pb-12 space-y-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {keyword ? (
              <p className="text-sm uppercase text-gray-400 font-semibold">
                Kết quả tìm kiếm
              </p>
            ) : (
              <p className="text-sm uppercase text-gray-400 font-semibold">
                Sản phẩm mới cập nhật
              </p>
            )}
            <h2 className="text-3xl font-bold text-gray-900">
              {keyword ? `Từ khóa “${keyword}”` : "Bộ sưu tập mới nhất"}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p className="px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm">
              {products.length} sản phẩm
            </p>
            {!keyword && (
              <p className="px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm">
                Giao nhanh 2h
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                  Danh mục
                </h3>
                <button
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, category: "" }))
                  }
                  className="text-xs text-blue-600"
                >
                  Xóa
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filter.category === ""}
                    onChange={handleFilterChange}
                  />
                  Tất cả
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat._id}
                      checked={filter.category === cat._id}
                      onChange={handleFilterChange}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                  Thương hiệu
                </h3>
                <button
                  onClick={() => setFilter((prev) => ({ ...prev, brand: "" }))}
                  className="text-xs text-blue-600"
                >
                  Xóa
                </button>
              </div>
              <select
                name="brand"
                value={filter.brand}
                onChange={handleFilterChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                Khoảng giá
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Từ (đ)"
                  value={filter.minPrice}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Đến (đ)"
                  value={filter.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() =>
                  setFilter({
                    category: "",
                    brand: "",
                    minPrice: "",
                    maxPrice: "",
                  })
                }
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Xóa bộ lọc
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] mb-2">
                Ưu đãi độc quyền
              </p>
              <p className="text-lg font-semibold mb-3">
                Giảm thêm 500.000đ cho khách hàng mới
              </p>
              <p className="text-sm text-blue-100">
                Nhập mã NEW500 khi thanh toán. Áp dụng cho đơn từ 15 triệu.
              </p>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Đang tải sản phẩm...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.slice(0, visibleCount).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {visibleCount < products.length && (
                  <div className="text-center mt-10">
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                    >
                      Xem thêm {products.length - visibleCount} sản phẩm
                      <span className="text-lg">↓</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Vui lòng thử lại với bộ lọc hoặc từ khóa khác.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
