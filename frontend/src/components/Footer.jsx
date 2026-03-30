// src/components/Footer.jsx
const supportLinks = [
  "Chính sách bảo hành",
  "Hướng dẫn mua trả góp",
  "Chính sách giao hàng",
  "Chính sách bảo mật",
  "Điều khoản sử dụng",
];

const customerServices = [
  "Tìm hiểu về LaptopStore",
  "Hệ thống siêu thị",
  "Kiểm tra đơn hàng",
  "Trung tâm bảo hành",
  "Tuyển dụng",
];

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 mt-auto font-sans">
      {/* Banner Đăng ký nhận tin */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">
              Đăng ký nhận tin khuyến mãi
            </h3>
            <p className="text-blue-100 text-sm font-medium">
              Nhận ngay voucher giảm giá 500K cho đơn hàng đầu tiên.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:bg-white focus:text-slate-900 transition-colors w-full sm:w-72"
            />
            <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors whitespace-nowrap shadow-lg">
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 mb-2 text-white">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight">
                LAPTOP<span className="text-blue-500">STORE</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Hệ thống bán lẻ laptop chính hãng hàng đầu. Cam kết giá tốt nhất,
              dịch vụ bảo hành tận tâm và trải nghiệm mua sắm tuyệt vời.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0"
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
                <span className="font-bold text-white">1800 1234</span> (Miễn
                phí từ 8h00 - 21h30)
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>cskh@laptopstore.vn</span>
              </div>
            </div>
          </div>

          {/* Cột 2 & 3: Link hỗ trợ */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-6">
                Hỗ trợ khách hàng
              </h4>
              <ul className="space-y-4">
                {supportLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-6">
                Về chúng tôi
              </h4>
              <ul className="space-y-4">
                {customerServices.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cột 4: Chứng nhận & Thanh toán */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
                Kết nối với chúng tôi
              </h4>
              <div className="flex gap-3">
                {["Facebook", "YouTube", "Instagram", "TikTok"].map(
                  (social, idx) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
                      title={social}
                    >
                      <span className="text-xs font-bold">
                        {social.charAt(0)}
                      </span>
                    </a>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
                Chứng nhận uy tín
              </h4>
              <img
                src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=b30b42f6-dc4a-4e8c-8ab5-f126131464db"
                alt="DMCA"
                className="h-6 opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} LAPTOP STORE. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">
              Chính sách bảo mật
            </a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-slate-300">
              Điều khoản dịch vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
