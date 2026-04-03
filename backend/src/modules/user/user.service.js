const User = require("./user.model");

const getProfileService = async (userId) => {
  // Tìm user theo id và LỌC BỎ các trường nhạy cảm (password, token reset)
  const user = await User.findById(userId).select(
    "-password -resetPasswordToken -resetPasswordExpires",
  );
  if (!user) throw new Error("Không tìm thấy người dùng.");
  return user;
};

const updateProfileService = async (userId, updateData) => {
  const { fullName, address, phoneNumber } = updateData;
  const user = await User.findById(userId);
  if (!user) throw new Error("Không tìm thấy người dùng.");

  // Chỉ cập nhật những trường nào người dùng có gửi lên
  if (fullName) user.fullName = fullName;
  if (address) user.address = address;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  await user.save();

  // Chuyển kết quả thành object và xóa đi mật khẩu trước khi trả về
  const updatedUser = user.toObject();
  delete updatedUser.password;
  delete updatedUser.resetPasswordToken;
  delete updatedUser.resetPasswordExpires;

  return updatedUser;
};

module.exports = { getProfileService, updateProfileService };
