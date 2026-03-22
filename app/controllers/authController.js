// ... (Import models User, bcrypt, jwt)
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/**
 * --- HÀM 1: ĐĂNG KÝ (REGISTER) ---*/
const register = async (req, res) => {
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
 * --- HÀM 2: ĐĂNG NHẬP (LOGIN) ---*/
const login = async (req, res) => {
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
 * --- HÀM 3: LẤY THÔNG TIN CÁ NHÂN (GET ME) ---*/
const getMe = async (req, res) => {
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

// cập nhật thông tin cá nhân (update profile)
const updateUserProfile = async (req, res) => {
  try {
    // 1. "Bảo vệ" protect đã chạy, ta có req.user.id
    //    (req.user cũng chứa thông tin user cũ)
    const userId = req.user.id;

    // 2. Lấy thông tin cần cập nhật từ body
    const { fullName, address, phoneNumber } = req.body;

    // 3. Tìm user trong DB (Mặc dù 'protect' đã tìm, nhưng cần tìm lại để có thể .save())
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }

    // 4. Cập nhật các trường
    user.fullName = fullName || user.fullName;
    user.address = address || user.address;
    user.phoneNumber = phoneNumber || user.phoneNumber;
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
    const { email } = req.body;

    // --- LOG 1: Kiểm tra xem Frontend có gọi tới đây không ---
    console.log("1. Đã nhận yêu cầu quên mật khẩu từ email:", email);

    if (!email) {
      return res.status(400).json({ success: false, message: "Thiếu email." });
    }

    const user = await User.findOne({ email: email });

    // --- LOG 2: Kiểm tra xem có tìm thấy user không ---
    if (!user) {
      console.log("2. Lỗi: Không tìm thấy User nào với email này!");
      // Vẫn trả về thành công để bảo mật (hackers không biết email nào tồn tại)
      return res.status(200).json({
        success: true,
        message: "Nếu email tồn tại, chúng tôi đã gửi link.",
      });
    }

    console.log("3. Đã tìm thấy User:", user.username);

    // Tạo token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Lưu vào DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // --- LOG 3: TOKEN QUAN TRỌNG ĐÂY RỒI ---
    console.log("======================================");
    console.log("🔑 COPY TOKEN NÀY:", resetToken);
    console.log("======================================");

    // Tạo link
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/resetpassword/${resetToken}`;

    const message = `Click vào đây để reset: <a href="${resetUrl}">Reset Password</a>`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message: message,
      });

      console.log("4. Đã gửi email thành công ");

      res.status(200).json({
        success: true,
        message: "Đã gửi email .",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log("Lỗi gửi email:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi gửi email." });
    }
  } catch (error) {
    console.log("Lỗi hệ thống:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
/**
 * --- HÀM 6: ĐẶT LẠI MẬT KHẨU (RESET PASSWORD) ---
 * Logic cho: PUT /api/auth/resetpassword/:resetToken
 */
const resetPassword = async (req, res) => {
  try {
    // 1. Lấy resetToken từ params và password mới từ body
    const { resetToken } = req.params;
    const { password } = req.body;

    console.log("-----------------------------------");
    console.log("1. Backend nhận yêu cầu Reset Password");
    console.log("2. Token nhận từ URL:", resetToken);
    console.log("3. Password nhận từ Body:", password);
    console.log("-----------------------------------");

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

    // ==========================================
    // 👉 BẮT ĐẦU ĐOẠN MỚI THÊM: Kiểm tra trùng mật khẩu cũ
    // ==========================================
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không được trùng với mật khẩu cũ.",
      });
    }
    // ==========================================
    // 👉 KẾT THÚC ĐOẠN MỚI THÊM
    // ==========================================

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
/**
 * --- HÀM 7: ĐỔI MẬT KHẨU (CHANGE PASSWORD) ---
 * Logic cho: PUT /api/auth/changepassword
 * Quyền truy cập: Private (User)
 *
 * Chức năng:
 * 1. Nhận mật khẩu cũ và mật khẩu mới
 * 2. Kiểm tra mật khẩu cũ có đúng không
 * 3. Mã hóa mật khẩu mới
 * 4. Cập nhật mật khẩu
 */
const changePassword = async (req, res) => {
  try {
    // 1. Lấy userId từ req.user (đã được gán bởi middleware 'protect')
    const userId = req.user.id;

    // 2. Lấy mật khẩu cũ và mật khẩu mới từ body
    const { currentPassword, newPassword } = req.body;

    // 3. Kiểm tra các trường bắt buộc
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.",
      });
    }

    // 4. Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      });
    }

    // 5. Tìm user trong DB (cần lấy cả password để so sánh)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // 6. Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không chính xác.",
      });
    }

    // 7. Kiểm tra mật khẩu mới có khác mật khẩu cũ không
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải khác mật khẩu cũ.",
      });
    }

    // 8. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 9. Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    // 10. Trả về thành công
    res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server. Vui lòng thử lại.",
    });
  }
};
// --- Xuất (Export) CẢ 7 HÀM ra ---
module.exports = {
  register,
  login,
  getMe,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};
