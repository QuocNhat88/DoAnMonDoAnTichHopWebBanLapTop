function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Thông tin chung */}
          <div>
            <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
            <p className="text-gray-400">
              Chuyên cung cấp laptop chính hãng, giá rẻ nhất thị trường. Bảo
              hành uy tín, chất lượng hàng đầu.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Đổi trả hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <p className="text-gray-400">📍 123 Đường ABC, TP.HCM</p>
            <p className="text-gray-400">📞 0909.123.456</p>
            <p className="text-gray-400">✉️ support@laptopstore.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
          © 2024 Laptop Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
