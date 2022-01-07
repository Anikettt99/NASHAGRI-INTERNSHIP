const User = require("../model/User");
const bcrypt = require("bcryptjs");
const HttpError = require("../model/http-error");
const generateToken = require("../config/generateToken");

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new HttpError("PLEASE INPUT ALL FIELD", 500);
    return next(error);
  }

  let user;
  try {
    user = await User.find({ email: email });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  if (user.length > 0) {
    const error = new HttpError("USER WITH THIS EMAIL ALREADY EXISTS", 400);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("UNKNOWN ERROR ACCOUNT CREATION FAILED", 500);
    return next(error);
  }

  try {
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new HttpError("PLEASE INPUT ALL FIELD", 500);
    return next(error);
  }
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("WRONG CREDENTIALS", 404);
    return next(error);
  }

  if (!bcrypt.compareSync(password, user.password)) {
    const error = new HttpError("WRONG CREDENTIALS", 404);
    return next(error);
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

exports.signUp = signUp;
exports.login = login;
