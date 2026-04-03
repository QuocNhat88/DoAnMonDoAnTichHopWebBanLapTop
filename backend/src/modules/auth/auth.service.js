const User = require("../user/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail"); // Cẩn thận đường dẫn này nhé

const registerService = async (userData) => {
  const { username, email, password } = userData;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw new Error("Email hoặc Username đã được sử dụng.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mật khẩu không chính xác.");

  const payload = { user: { id: user._id, role: user.role } };
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  return { token, user };
};

const updateUserProfileService = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Không tìm thấy người dùng.");

  user.fullName = updateData.fullName || user.fullName;
  user.address = updateData.address || user.address;
  user.phoneNumber = updateData.phoneNumber || user.phoneNumber;

  return await user.save();
};

const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Không tìm thấy người dùng.");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu hiện tại không chính xác.");

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) throw new Error("Mật khẩu mới phải khác mật khẩu cũ.");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
};

const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return; // Bảo mật: Vẫn giả vờ thành công nếu email không tồn tại

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/resetpassword/${resetToken}`;
  const message = `Click vào đây để đặt lại mật khẩu: <a href="${resetUrl}">Reset Password</a>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Yêu cầu khôi phục mật khẩu",
      message: message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error("Lỗi gửi email.");
  }
};

const resetPasswordService = async (resetToken, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    throw new Error(
      "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.",
    );

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword)
    throw new Error("Mật khẩu mới không được trùng với mật khẩu cũ.");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

module.exports = {
  registerService,
  loginService,
  updateUserProfileService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
};
