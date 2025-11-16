// ... (Import models User, bcrypt, jwt)
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// --- Xuất (Export) CẢ 4 HÀM ra ---
module.exports = {
  register,
  login,
  getMe,
  updateUserProfile, // (Hàm mới)
};
