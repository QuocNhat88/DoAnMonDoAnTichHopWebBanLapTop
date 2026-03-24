// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import productApi from "../api/productApi";
import { CartContext } from "../context/CartContext";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await productApi.get(id);
        setProduct(response.data || response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const images = [
      ...(Array.isArray(product.images) ? product.images : []),
      product.thumbnail,
    ]
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    const fallback =
      images.length > 0
        ? images
        : [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
          ];
    setGalleryImages(fallback);
    setActiveImage(fallback[0]);
  }, [product]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        <p className="text-gray-500 font-medium text-lg">
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <svg
          className="w-20 h-20 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-gray-500 font-bold text-xl">
          Không tìm thấy sản phẩm!
        </p>
        <Link to="/" className="text-blue-600 font-semibold hover:underline">
          Quay lại trang chủ
        </Link>
      </div>
    );

  const priceValue = product.price || 0;
  const originalPrice = product.originalPrice || priceValue;
  const hasDiscount = originalPrice > priceValue;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - priceValue) / originalPrice) * 100)
    : 0;
  const priceSaving = hasDiscount ? originalPrice - priceValue : 0;
  const availableQuantity = product.countInStock ?? product.stock ?? 0;
  const isAvailable = availableQuantity > 0;
  const stockStatus = isAvailable ? "Còn hàng tại kho" : "Liên hệ để đặt trước";

  const highlightList = Array.isArray(product.highlights)
    ? product.highlights
    : (product.description || "")
        .split(".")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4);

  const specEntries = (() => {
    const formatValue = (value) => {
      if (value === null || value === undefined) return "Đang cập nhật";
      if (typeof value === "string") return value;
      if (typeof value === "number") return `${value}`;
      if (Array.isArray(value)) return value.join(", ");
      return JSON.stringify(value);
    };

    if (Array.isArray(product.specifications)) {
      return product.specifications.map((item) =>
        typeof item === "string"
          ? (() => {
              const [label, ...rest] = item.split(":");
              return {
                label: label?.trim() || "Thông tin khác",
                value: rest.join(":").trim() || "Đang cập nhật",
              };
            })()
          : {
              label: item.label || "Thông tin khác",
              value: formatValue(item.value),
            },
      );
    }
    if (product.specifications && typeof product.specifications === "object") {
      return Object.entries(product.specifications).map(([label, value]) => ({
        label,
        value: formatValue(value),
      }));
    }
    if (product.specs && typeof product.specs === "object") {
      return Object.entries(product.specs).map(([label, value]) => ({
        label,
        value: formatValue(value),
      }));
    }
    return [
      { label: "Thương hiệu", value: product.brand?.name || "Đang cập nhật" },
      {
        label: "Dòng sản phẩm",
        value: product.category?.name || "Đang cập nhật",
      },
      { label: "CPU", value: product.cpu || "Đang cập nhật" },
      { label: "RAM", value: product.ram || "Đang cập nhật" },
      { label: "Ổ cứng", value: product.storage || "Đang cập nhật" },
      { label: "Màn hình", value: product.screen || "Đang cập nhật" },
      { label: "Card đồ họa", value: product.gpu || "Đang cập nhật" },
      { label: "Trọng lượng", value: product.weight || "Đang cập nhật" },
    ];
  })();

  const serviceBadges = [
    {
      title: "Bảo hành",
      value: "36 tháng chính hãng",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
    {
      title: "Đổi trả",
      value: "1 đổi 1 trong 30 ngày",
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    },
    {
      title: "Giao hàng",
      value: "Miễn phí toàn quốc",
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    },
    {
      title: "Trả góp",
      value: "Hỗ trợ 0% qua thẻ",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <nav className="py-4 px-2 text-sm text-gray-500 font-medium">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="hover:text-blue-600 cursor-pointer transition-colors">
          {product.category?.name || "Laptop"}
        </span>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-bold truncate">{product.name}</span>
      </nav>

      <div className="space-y-6">
        {/* KHỐI TRÊN: ẢNH + THÔNG TIN CHÍNH */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8">
          <div className="grid gap-10 lg:grid-cols-[1fr,1fr] xl:grid-cols-[45%,55%]">
            {/* Cột trái: Ảnh */}
            <div className="flex flex-col gap-4">
              {/* Ảnh chính */}
              <div className="relative bg-slate-50 border border-gray-100 rounded-3xl p-6 flex items-center justify-center aspect-square md:aspect-[4/3] group overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold text-gray-800 uppercase tracking-widest shadow-sm border border-gray-200 z-10">
                  {product.brand?.name || "Laptop"}
                </div>
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg z-10">
                    Giảm {discountPercent}%
                  </div>
                )}
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Thumbs (Cuộn ngang trên mobile) */}
              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                {galleryImages.map((image, idx) => (
                  <button
                    key={`${image}-${idx}`}
                    onClick={() => setActiveImage(image)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl border-2 p-2 flex items-center justify-center bg-slate-50 transition-all ${
                      activeImage === image
                        ? "border-blue-600 shadow-md bg-white"
                        : "border-transparent hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Cột phải: Thông tin */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div
                    className={`flex items-center gap-1.5 ${isAvailable ? "text-emerald-600" : "text-orange-500"}`}
                  >
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAvailable ? "bg-emerald-400" : "bg-orange-400"}`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${isAvailable ? "bg-emerald-500" : "bg-orange-500"}`}
                      ></span>
                    </span>
                    {stockStatus}
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">
                    Mã SP:{" "}
                    {product._id?.substring(0, 8).toUpperCase() ||
                      "Đang cập nhật"}
                  </span>
                </div>
              </div>

              {/* Box Giá */}
              <div className="bg-gradient-to-r from-slate-50 to-white border border-gray-100 rounded-3xl p-6 mb-8 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                  <p className="text-4xl md:text-5xl font-black text-red-600 tracking-tight">
                    {priceValue?.toLocaleString("vi-VN")} ₫
                  </p>
                  {hasDiscount && (
                    <div className="flex flex-col mb-1">
                      <span className="text-lg text-gray-400 line-through font-semibold">
                        {originalPrice?.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  )}
                </div>
                {hasDiscount && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Tiết kiệm {priceSaving.toLocaleString("vi-VN")} ₫
                  </div>
                )}
              </div>

              {/* Nút Call to action */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => addToCart(product)}
                  disabled={!isAvailable}
                  className={`flex flex-col items-center justify-center py-3.5 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-1 ${
                    isAvailable
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  <span className="text-lg flex items-center gap-2">
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Thêm vào giỏ
                  </span>
                  <span className="text-[10px] font-normal opacity-80 uppercase tracking-wider">
                    Giao tận nơi hoặc nhận tại siêu thị
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center py-3.5 rounded-2xl font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                  <span className="text-lg flex items-center gap-2">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Gọi tư vấn
                  </span>
                  <span className="text-[10px] font-normal uppercase tracking-wider">
                    Miễn phí 24/7 (1800.xxxx)
                  </span>
                </button>
              </div>

              {/* Đặc điểm nổi bật (Highlights) */}
              {highlightList.length > 0 && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 mb-8">
                  <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Đặc điểm nổi bật
                  </h3>
                  <ul className="space-y-3">
                    {highlightList.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-3 text-[15px] text-gray-700 font-medium"
                      >
                        <svg
                          className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                {serviceBadges.map((service) => (
                  <div
                    key={service.title}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
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
                          d={service.icon}
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        {service.title}
                      </p>
                      <p className="text-xs font-bold text-gray-800">
                        {service.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI DƯỚI: THÔNG SỐ & CHÍNH SÁCH */}
        <div className="grid gap-6 lg:grid-cols-[1fr,350px]">
          {/* Cột trái: Thông số kỹ thuật */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900">
                Thông số kỹ thuật
              </h2>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {specEntries.length} thông tin
              </span>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              {specEntries.map((spec, index) => (
                <div
                  key={`${spec.label}-${index}`}
                  className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-2 px-5 py-4 even:bg-slate-50 border-b last:border-0 border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <p className="text-sm font-bold text-gray-500">
                    {spec.label}
                  </p>
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {spec.value || "Đang cập nhật"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cột phải: Chính sách */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 h-fit sticky top-24">
            <h2 className="text-xl font-black text-gray-900 mb-6">
              Chính sách mua hàng
            </h2>
            <ul className="space-y-4 text-sm text-gray-700 font-medium mb-8">
              <li className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-blue-600 bg-blue-50 p-2 rounded-lg h-fit">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span>
                  Giao hàng cực nhanh{" "}
                  <strong className="text-gray-900">miễn phí</strong> trong 2
                  giờ nội thành.
                </span>
              </li>
              <li className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-blue-600 bg-blue-50 p-2 rounded-lg h-fit">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span>
                  Bảo hành chính hãng{" "}
                  <strong className="text-gray-900">36 tháng</strong> tận nơi.
                </span>
              </li>
              <li className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-blue-600 bg-blue-50 p-2 rounded-lg h-fit">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span>
                  Lỗi là đổi mới trong{" "}
                  <strong className="text-gray-900">30 ngày</strong> đầu tiên.
                </span>
              </li>
            </ul>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-inner relative overflow-hidden">
              <svg
                className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.042 11.042 0 005.115 5.115l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <p className="text-xs uppercase tracking-widest font-black text-blue-200 mb-2">
                Cần tư vấn thêm?
              </p>
              <p className="text-lg font-bold mb-1">Tổng đài 1800.xxxx</p>
              <p className="text-xs text-blue-100 opacity-90">
                Kỹ thuật viên luôn sẵn sàng hỗ trợ bạn chọn cấu hình tối ưu
                nhất.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
