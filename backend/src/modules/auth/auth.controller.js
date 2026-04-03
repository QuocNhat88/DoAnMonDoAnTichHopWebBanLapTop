const authService = require("./auth.service");

const register = async (req, res) => {
  try {
    const newUser = await authService.registerService(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.loginService(
      req.body.email,
      req.body.password,
    );
    return res
      .status(200)
      .json({ success: true, message: "Đăng nhập thành công!", ...data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfileService(
      req.user.id,
      req.body,
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật thành công!",
        data: updatedUser,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    await authService.changePasswordService(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword,
    );
    return res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPasswordService(req.body.email);
    return res
      .status(200)
      .json({
        success: true,
        message: "Nếu email tồn tại, chúng tôi đã gửi link.",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPasswordService(req.params.token, req.body.password);
    return res
      .status(200)
      .json({ success: true, message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
