const express = require('express');
const Joi = require('joi');
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');

const {authMiddleware} = require('../../middlewares/authMiddleware');
const {upload} = require('../../middlewares/uploadMiddleware');

const authRouter = new express.Router();

const userSingupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const {registr, login, logout, updateAvatar} = require('../../models/users');

authRouter.post('/registration', async (req, res, next) => {
  const {error} = userSingupSchema.validate(req.body);
  const {email, password} = req.body;

  if (error) {
    return res.status(400).json({
      status: 'Bad Request',
      ResponseBody: {
        message: 'missing some input fields',
      },
    });
  }
  try {
    await registr(email, password);
    res.status(201).json({
      status: 'Created',
      ResponseBody: {
        user: {
          email: email,
          subscription: 'starter',
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  const {error} = userLoginSchema.validate(req.body);
  const {email, password, avatar} = req.body;
  if (error) {
    return res.status(400).json({
      status: 'Bad Request',
      ResponseBody: {
        message: 'missing some input fields',
      },
    });
  }
  try {
    const result = await login(email, password);
    res.status(200).json({
      Status: 'OK',
      ResponseBody: {
        token: result.token,
        user: {
          email: email,
          avatar: avatar,
          subscription: result.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/logout', authMiddleware, async (req, res, next) => {
  const {_id} = req.user;
  try {
    await logout(_id);
    res.status(204).json({
      ResponseBody: {message: 'No Content'},
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/current', authMiddleware, (req, res, next) => {
  try {
    const {email, subscription} = req.user;
    res.status(200).json({
      status: 'OK',
      ResponseBody: {
        email: email,
        subscription: subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.patch(
    '/avatars',
    authMiddleware,
    upload.single('avatar'),
    async (req, res, next) => {
      const {email, _id} = req.user;
      const avatarDir = path.join(__dirname, '../../', 'public/avatars');
      const resultAvatarPath = `${path.join(
          avatarDir,
          req.file.originalname,
      )}${email}.jpg`;
      const avatar = await jimp.read(req.file.path);
      await avatar
          .autocrop()
          .cover(
              250,
              250,
              jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE,
          )
          .writeAsync(req.file.path);
      try {
        fs.rename(req.file.path, resultAvatarPath);
      } catch (error) {
        await fs.unlink(req.file.path);
      }
      try {
        await updateAvatar(_id, resultAvatarPath);
        res.status(200).json({
          Status: 'OK',
          ResponseBody: {
            avatarUrl: resultAvatarPath,
          },
        });
      } catch (error) {
        next(error);
      }
    },
);

module.exports = authRouter;
