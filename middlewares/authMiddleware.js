const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET_KEY;
const { User } = require("../db/userModel");
const { MiddlewareUnauthorizedError } = require("../helpers/error");

const authMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  try {
    if (bearer !== "Bearer") {
      throw new MiddlewareUnauthorizedError("Not authorized");
    }
    const { id } = jwt.verify(token, secret);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw new MiddlewareUnauthorizedError("Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = {
  authMiddleware,
};
