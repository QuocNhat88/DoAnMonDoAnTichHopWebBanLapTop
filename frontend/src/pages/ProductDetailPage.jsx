// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
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
      <div className="min-h-[400px] flex items-center justify-center text-gray-500">
        Đang tải...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-[400px] flex items-center justify-center text-gray-500">
        Không tìm thấy sản phẩm!
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
  const stockStatus =
    availableQuantity > 0 ? "Còn hàng tại kho" : "Liên hệ để đặt trước";
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
            }
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
    { title: "Bảo hành", value: "36 tháng chính hãng" },
    { title: "Đổi trả", value: "1 đổi 1 trong 30 ngày" },
    { title: "Giao hàng", value: "Miễn phí toàn quốc" },
    { title: "Trả góp", value: "Hỗ trợ 0% qua thẻ tín dụng" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="relative bg-gray-100 rounded-3xl p-6 flex items-center justify-center">
                <div className="absolute top-4 left-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
                  {product.brand?.name || "Laptop"}
                </div>
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{discountPercent}%
                  </div>
                )}
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-[420px] object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {galleryImages.map((image) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(image)}
                    className={`rounded-2xl border p-2 h-24 flex items-center justify-center bg-white transition ${
                      activeImage === image
                        ? "border-blue-600 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt="thumb"
                      className="max-h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-600">
                  {product.brand?.name || "Laptop chính hãng"}
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500">{stockStatus}</p>
              </div>

              <div className="flex items-end gap-3">
                <p className="text-4xl font-black text-red-600">
                  {product.price?.toLocaleString("vi-VN")} đ
                </p>
                {hasDiscount && (
                  <div className="flex flex-col text-sm text-gray-500">
                    <span className="line-through">
                      {originalPrice?.toLocaleString("vi-VN")} đ
                    </span>
                    <span className="text-green-600 font-semibold">
                      Tiết kiệm {priceSaving.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-500 transition shadow-lg"
                >
                  🛒 Thêm vào giỏ
                </button>
                <button className="border border-gray-200 py-3 rounded-2xl font-semibold text-gray-800 hover:border-blue-400 hover:text-blue-600 transition">
                  Gọi tư vấn 24/7
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {serviceBadges.map((service) => (
                  <div
                    key={service.title}
                    className="border border-gray-100 rounded-2xl p-3 bg-gray-50"
                  >
                    <p className="text-xs uppercase text-gray-400">
                      {service.title}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {service.value}
                    </p>
                  </div>
                ))}
              </div>

              {highlightList.length > 0 && (
                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    Điểm nổi bật
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                    {highlightList.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 bg-white rounded-3xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Thông số kỹ thuật
              </h2>
              <span className="text-sm text-gray-400">
                {specEntries.length} thông tin
              </span>
            </div>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {specEntries.map((spec, index) => (
                <div
                  key={`${spec.label}-${index}`}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-4 py-3 bg-white"
                >
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {spec.label}
                  </p>
                  <p className="sm:col-span-2 text-sm text-gray-800">
                    {spec.value || "Đang cập nhật"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Chính sách & hỗ trợ
            </h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="text-green-500">✓</span> Miễn phí giao hàng nội
                thành trong 2 giờ
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span> Lắp đặt tận nơi dành
                cho doanh nghiệp
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span> Tư vấn cấu hình theo
                nhu cầu miễn phí
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span> Hỗ trợ kỹ thuật 24/7
                qua hotline và chat
              </li>
            </ul>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-sm">
              <p className="font-semibold text-blue-700">Cần cấu hình riêng?</p>
              <p className="text-blue-600">
                Liên hệ 1900 1234 để được kỹ thuật viên đề xuất cấu hình tối ưu
                cho công việc của bạn.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
