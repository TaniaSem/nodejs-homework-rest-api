const {User} = require('../db/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const gravatar = require('gravatar');
const {v4: uuidv4} = require('uuid');

const {
  RegistrationConflictError,
  LoginAuthError,
  LogoutUnauthorizedError,
  VerifyError,
  LoginValidationError,
} = require('../helpers/error');
require('dotenv').config();

const secret = process.env.SECRET_KEY;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const registr = async (email, password) => {
  const user = await User.findOne({email});
  if (user) {
    throw new RegistrationConflictError('Email in use');
  }
  const avatarURL = gravatar.url(email);
  const newVerificationToken = uuidv4();
  const newUser = new User({
    email,
    password: await bcrypt.hash(password, 10),
    avatarURL,
    verificationToken: newVerificationToken,
  });
  await newUser.save();

  const msg = {
    to: email,
    from: 'semenchuktetiana@gmail.com',
    subject: 'Verify email',
    // eslint-disable-next-line max-len
    html: '<p>Thanks for your registration in our APP. For verify your account go to <a href="http://localhost:3000/api/auth/verify/${newVerifyToken}">Confirm your email</a></p>',
  };

  await sgMail.send(msg);
};

const login = async (email, password) => {
  const user = await User.findOne({email, verify: true});
  if (!user) {
    throw new LoginAuthError('Email or password is wrong');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new LoginAuthError('Email or password is wrong');
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, secret, {expiresIn: '1h'});
  await User.updateOne({email}, {token});
  return {
    token,
    subscription: user.subscription,
  };
};

const logout = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new LogoutUnauthorizedError('Not authorized');
  }
  await User.findByIdAndUpdate(id, {token: null});
};

const verify = async (verificationToken) => {
  const isVerify = await User.findOne(verificationToken);
  if (!isVerify) {
    throw new VerifyError('User not found');
  }
  await User.updateOne(
      {verificationToken},
      {verificationToken: null, verify: true},
  );
};

const reVarification = async (email) => {
  const user = User.findOne({email, verify: false});

  if (!user) {
    throw new LoginValidationError('Verification has already been passed');
  }

  const msg = {
    to: email,
    from: 'semenchuktetiana@gmail.com',
    subject: 'Verify email',
    // eslint-disable-next-line max-len
    html: '<p>Thanks for your registration in our APP. For verify your account go to <a href="http://localhost:3000/api/auth/verify/${user.verificationToken}">Confirm your email</a></p>',
  };

  await sgMail.send(msg);
};

const updateAvatar = async (id, avatarPath) => {
  const user = await User.findById(id);
  if (!user) {
    throw createError(401, 'Not authorized', {status: 'Unauthorized'});
  }
  await User.findByIdAndUpdate(id, {avatarURL: avatarPath});
};

module.exports = {
  registr,
  login,
  logout,
  updateAvatar,
  verify,
  reVarification,
};
