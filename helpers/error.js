class RegistrationConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}
// "message": "Email in use"

class LoginValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
// ResponseBody: <Помилка від Joi або іншої бібліотеки валідації>

class LoginAuthError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
//   "message": "Email or password is wrong"

class LogoutUnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class MiddlewareUnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  LoginAuthError,
  LoginValidationError,
  RegistrationConflictError,
  LogoutUnauthorizedError,
  MiddlewareUnauthorizedError,
};
