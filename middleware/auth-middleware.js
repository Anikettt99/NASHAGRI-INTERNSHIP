const HttpError = require("../model/http-error");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
  let token;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    const error = new HttpError("NOT AUTHENTICATED", 401);
    return next(error);
  }

  token = req.headers.authorization.split(" ")[1];

  if (!token) {
    const error = new HttpError("NOT AUTHENTICATED", 401);
    return next(error);
  }

  let user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    user = await User.findById(decoded.id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("NOT AUTHENTICATED", 401);
    return next(error);
  }
  next();
};

module.exports = { protect };
