// ... (Import models User, bcrypt, jwt)
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/**
 * --- HÀM 1: ĐĂNG KÝ (REGISTER) ---
 * (Hàm này bạn đã có - KHÔNG THAY ĐỔI)
 */
const register = async (req, res) => {
  // ... (Toàn bộ code "Đăng ký" của bạn)
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc Username đã được sử dụng.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server. Vui lòng thử lại.",
    });
  }
};

/**
 * --- HÀM 2: ĐĂNG NHẬP (LOGIN) ---
 * (Hàm này bạn đã có - KHÔNG THAY ĐỔI)
 */
const login = async (req, res) => {
  // ... (Toàn bộ code "Đăng nhập" của bạn)
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email không tồn tại." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không chính xác." });
    }
    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token: token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server. Vui lòng thử lại.",
    });
  }
};

/**
 * --- HÀM 3: LẤY THÔNG TIN CÁ NHÂN (GET ME) ---
 * (Hàm này bạn đã có - KHÔNG THAY ĐỔI)
 */
const getMe = async (req, res) => {
  // ... (Toàn bộ code "Lấy thông tin cá nhân" của bạn)
  try {
    res.status(200).json({
      success: true,
      data: req.user, // Trả về thông tin user
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cá nhân:", error.message);
    res.status(500).send("Server Error");
  }
};

// --- PHẦN CẬP NHẬT (THÊM 1 HÀM MỚI) ---

/**
 * --- HÀM 6: CẬP NHẬT THÔNG TIN CÁ NHÂN (UPDATE PROFILE) ---
 * Logic cho: PUT /api/auth/profile
 * Quyền truy cập: Private (User)
 */
const updateUserProfile = async (req, res) => {
  try {
    // 1. "Bảo vệ" protect đã chạy, ta có req.user.id
    //    (req.user cũng chứa thông tin user cũ)
    const userId = req.user.id;

    // 2. Lấy thông tin cần cập nhật từ body
    const { fullName, address, phoneNumber } = req.body;

    // 3. Tìm user trong DB (Mặc dù 'protect' đã tìm,
    //    nhưng chúng ta cần tìm lại để có thể .save())
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }

    // 4. Cập nhật các trường
    //    Chúng ta dùng (user.field = ... || user.field)
    //    để nếu người dùng không gửi 'fullName',
    //    nó sẽ tự giữ lại 'fullName' cũ.
    user.fullName = fullName || user.fullName;
    user.address = address || user.address;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    // (Lưu ý: Chúng ta KHÔNG cho phép sửa 'email', 'username'
    //  hay 'password' ở đây. Đó là các chức năng riêng biệt)

    // 5. Lưu lại thông tin user đã cập nhật
    const updatedUser = await user.save();

    // 6. Trả về user mới (trừ password)
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công!",
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        address: updatedUser.address,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// --- PHẦN CẬP NHẬT (THÊM 2 HÀM MỚI CHO QUÊN MẬT KHẨU) ---

/**
 * --- HÀM 5: QUÊN MẬT KHẨU (FORGOT PASSWORD) ---
 * Logic cho: POST /api/auth/forgotpassword
 * Quyền truy cập: Public
 *
 * Chức năng:
 * 1. Nhận email từ người dùng
 * 2. Tạo reset token (mã bảo mật)
 * 3. Lưu token vào database (có thời hạn 10 phút)
 * 4. Gửi email chứa link reset password
 */
const forgotPassword = async (req, res) => {
  try {
    // 1. Lấy email từ body
    const { email } = req.body;

    // 2. Kiểm tra email có được gửi không
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email của bạn.",
      });
    }

    // 3. Tìm user theo email
    const user = await User.findOne({ email: email });

    // 4. Nếu không tìm thấy user, vẫn trả về thành công
    //    (Để tránh lộ thông tin email có tồn tại hay không)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Nếu email tồn tại, chúng tôi đã gửi link reset mật khẩu.",
      });
    }

    // 5. Tạo Reset Token (mã bảo mật ngẫu nhiên)
    //    crypto.randomBytes(32) tạo ra 32 bytes ngẫu nhiên
    //    .toString('hex') chuyển thành chuỗi hex (64 ký tự)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 6. Mã hóa token trước khi lưu vào database
    //    (Để bảo mật hơn, nếu ai đó hack được database)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 7. Lưu token đã mã hóa và thời gian hết hạn (10 phút) vào database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save({ validateBeforeSave: false }); // Bỏ qua validation

    // 7.5. Log token ra console để test (CHỈ DÙNG KHI DEVELOPMENT)
    console.log("===========================================");
    console.log("🔑 RESET TOKEN (Dùng để test trong Postman):");
    console.log(resetToken);
    console.log("===========================================");

    // 8. Tạo URL reset password
    //    (Bạn có thể thay đổi URL này tùy theo frontend của bạn)
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/resetpassword/${resetToken}`;

    // 9. Tạo nội dung email
    const message = `
      <h2>Xin chào ${user.username || user.email},</h2>
      <p>Bạn đã yêu cầu reset mật khẩu cho tài khoản của mình.</p>
      <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Mật Khẩu
      </a>
      <p>Link này sẽ hết hạn sau <strong>10 phút</strong>.</p>
      <p>Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.</p>
      <hr>
      <p><small>WebBanLaptop Team</small></p>
    `;

    // 10. Gửi email
    try {
      await sendEmail({
        email: user.email,
        subject: "Yêu cầu Reset Mật Khẩu - WebBanLaptop",
        message: message,
      });

      res.status(200).json({
        success: true,
        message:
          "Email reset mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.",
      });
    } catch (error) {
      // Nếu gửi email thất bại, xóa token đã lưu
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Lỗi khi gửi email:", error.message);
      return res.status(500).json({
        success: false,
        message: "Không thể gửi email. Vui lòng thử lại sau.",
      });
    }
  } catch (error) {
    console.error("Lỗi khi xử lý quên mật khẩu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server. Vui lòng thử lại.",
    });
  }
};

/**
 * --- HÀM 6: ĐẶT LẠI MẬT KHẨU (RESET PASSWORD) ---
 * Logic cho: PUT /api/auth/resetpassword/:resetToken
 * Quyền truy cập: Public
 *
 * Chức năng:
 * 1. Nhận resetToken và password mới
 * 2. Kiểm tra token có hợp lệ và chưa hết hạn không
 * 3. Mã hóa password mới
 * 4. Cập nhật password và xóa token
 */
const resetPassword = async (req, res) => {
  try {
    // 1. Lấy resetToken từ params và password mới từ body
    const { resetToken } = req.params;
    const { password } = req.body;

    // 2. Kiểm tra password có được gửi không
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mật khẩu mới.",
      });
    }

    // 3. Kiểm tra độ dài mật khẩu (tùy chọn)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
    }

    // 4. Mã hóa token để so sánh với token trong database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5. Tìm user có token này và token chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // $gt = greater than (lớn hơn)
    });

    // 6. Nếu không tìm thấy user hoặc token đã hết hạn
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu reset lại.",
      });
    }

    // 7. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 8. Cập nhật password và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // 9. Trả về thành công
    res.status(200).json({
      success: true,
      message:
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.",
    });
  } catch (error) {
    console.error("Lỗi khi reset mật khẩu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server. Vui lòng thử lại.",
    });
  }
};

// --- Xuất (Export) CẢ 6 HÀM ra ---
module.exports = {
  register,
  login,
  getMe,
  updateUserProfile,
  forgotPassword, // (Hàm mới)
  resetPassword, // (Hàm mới)
};
