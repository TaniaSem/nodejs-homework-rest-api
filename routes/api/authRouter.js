const express = require("express");
const Joi = require("joi");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const authRouter = new express.Router();

const userSingupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const { registr, login, logout } = require("../../models/users");

authRouter.post("/registration", async (req, res, next) => {
  const { error } = userSingupSchema.validate(req.body);
  const { email, password } = req.body;

  if (error) {
    return res.status(400).json({
      status: "Bad Request",
      ResponseBody: {
        message: "missing some input fields",
      },
    });
  }
  try {
    await registr(email, password);
    res.status(201).json({
      status: "Created",
      ResponseBody: {
        user: {
          email: email,
          subscription: "starter",
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  const { email, password } = req.body;
  if (error) {
    return res.status(400).json({
      status: "Bad Request",
      ResponseBody: {
        message: "missing some input fields",
      },
    });
  }
  try {
    const result = await login(email, password);
    res.status(200).json({
      Status: "OK",
      ResponseBody: {
        token: result.token,
        user: {
          email: email,
          subscription: result.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/logout", authMiddleware, async (req, res, next) => {
  const { _id } = req.user;
  try {
    await logout(_id);
    res.status(204).json({
      ResponseBody: { message: "No Content" },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/current", authMiddleware, (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      status: "OK",
      ResponseBody: {
        email: email,
        subscription: subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
