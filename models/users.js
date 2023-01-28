const { User } = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const {
  RegistrationConflictError,
  LoginAuthError,
  LogoutUnauthorizedError,
} = require("../helpers/error");
require("dotenv").config();

const secret = process.env.SECRET_KEY;

const registr = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new RegistrationConflictError("Email in use");
  }
  const avatarURL = gravatar.url(email);
  const newUser = new User({
    email,
    password: await bcrypt.hash(password, 10),
    avatarURL,
  });
  await newUser.save();
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new LoginAuthError("Email or password is wrong");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new LoginAuthError("Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.updateOne({ email }, { token });
  return {
    token,
    subscription: user.subscription,
  };
};

const logout = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new LogoutUnauthorizedError("Not authorized");
  }
  await User.findByIdAndUpdate(id, { token: null });
};

const updateAvatar = async (id, avatarPath) => {
  const user = await User.findById(id);
  if (!user) {
    throw createError(401, "Not authorized", { status: "Unauthorized" });
  }
  await User.findByIdAndUpdate(id, { avatarURL: avatarPath });
};

module.exports = {
  registr,
  login,
  logout,
  updateAvatar,
};
