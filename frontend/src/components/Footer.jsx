const supportLinks = [
  "Chính sách bảo hành",
  "Hướng dẫn mua trả góp",
  "Giao nhận & thanh toán",
  "Điều khoản sử dụng",
];

const customerServices = [
  "Theo dõi đơn hàng",
  "Trung tâm bảo hành",
  "Góp ý & khiếu nại",
  "Tuyển dụng",
];

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-3">
              LapTopStore
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Hệ thống bán lẻ laptop chính hãng cho học tập, làm việc và gaming.
              Cam kết giá tốt, giao nhanh và chăm sóc hậu mãi tận tâm.
            </p>
            <div className="flex items-center gap-3 text-xl">
              <a href="#" className="hover:text-blue-400">
                ƒ
              </a>
              <a href="#" className="hover:text-blue-400">
                ►
              </a>
              <a href="#" className="hover:text-blue-400">
                ⌾
              </a>
              <a href="#" className="hover:text-blue-400">
                in
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {supportLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Dịch vụ nổi bật
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {customerServices.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-white">Liên hệ</p>
            <p>📍 123 Nguyễn Thị Minh Khai, Quận 1, TP.HCM</p>
            <p>📞 1900 1234 (7h30 - 21h30)</p>
            <p>✉️ support@LapTopStore.vn</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-white">Thời gian làm việc</p>
            <p>Thứ 2 - Thứ 7: 8h00 - 21h30</p>
            <p>Chủ nhật & Lễ: 9h00 - 18h00</p>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LapTopStore. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
