const HttpError = require("../model/http-error");
const Income = require("../model/Income");
const mongoose = require("mongoose");

const addIncome = async (req, res, next) => {
  const { details, amount, type, status, date } = req.body;
  if (!details || !amount || !type || !status || !date) {
    const error = new HttpError("PLEASE INPUT ALL FIELD", 500);
    return next(error);
  }

  let newIncome;
  try {
    newIncome = await Income.create({
      details,
      amount,
      type,
      status,
      date,
      user: req.userId,
    });
  } catch (err) {
    // console.log(err);
    const error = new HttpError("UNKNOWN ERROR", 404);
    return next(error);
  }

  res.status(201).json({
    message: "Income Added Successfully",
  });
};

const getAllIncome = async (req, res, next) => {
  const userId = req.userId;
  let allIncome;
  try {
    allIncome = await Income.find({ user: userId });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  res.status(201).json({ allIncome });
};

const updateIncome = async (req, res, next) => {
  const { id, details, amount, type, status } = req.body;
  if (!id || !details || !amount || !type || !status) {
    const error = new HttpError("INVALID FIELDS", 500);
    return next(error);
  }
  let income;
  try {
    income = await Income.findById(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!income) {
    const error = new HttpError("NO DATA FOUND", 500);
    return next(error);
  }

  if (income.user.toString() !== req.userId) {
    const error = new HttpError("YOU ARE NOT AUTHENTICATED", 500);
    return next(error);
  }

  income.details = details;
  income.amount = amount;
  income.type = type;
  income.status = status;

  try {
    await income.save();
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  res.status(201).json({
    message: "UDATED SUCCESSFULLY",
  });
};

const deleteIncome = async (req, res, next) => {
  const id = req.params.id;
  let income;
  try {
    income = await Income.findById(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!income) {
    const error = new HttpError("NO DATA FOUND", 500);
    return next(error);
  }

  if (income.user.toString() !== req.userId) {
    const error = new HttpError("YOU ARE NOT AUTHENTICATED", 500);
    return next(error);
  }

  try {
    await Income.findByIdAndRemove(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  res.status(201).json({
    message: "DELETED SUCCESSFULLY",
  });
};

const remaiderOfIncome = async (req, res, next) => {
  const userId = req.userId;
  let all_income;
  try {
    all_income = await Income.find({ user: userId, status: "TO BE COME" });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  let to_be_come = [];
  let overdue = [];
  const n = all_income.length;

  for (let i = 0; i < n; i++) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const day1 = new Date(Date.now());
    const day2 = all_income[i].date;
    const utc1 = Date.UTC(day1.getFullYear(), day1.getMonth(), day1.getDate());
    const utc2 = Date.UTC(day2.getFullYear(), day2.getMonth(), day2.getDate());
    const difference = Math.floor((utc2 - utc1) / MS_PER_DAY);

    if (difference <= 3 && difference >= 0) {
      const income = all_income[i].toObject();
      income.to_be_come_in = difference;
      to_be_come.push(income);
    }
    if (difference < 0) {
      const income = all_income[i].toObject();
      income.over_due_by = -difference;
      overdue.push(income);
    }
  }
  res.status(201).json({
    to_be_come,
    overdue,
  });
};

const getIncome = async (req, res, next) => {
  const id = req.params.id;

  let income;
  try {
    income = await Income.findById(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!income) {
    const error = new HttpError("NO DATA FOUND", 404);
    return next(error);
  }

  if (income.user.toString() !== req.userId) {
    const error = new HttpError("YOU ARE NOT AUTHENTICATED", 500);
    return next(error);
  }

  res.status(201).json({
    income,
  });
};

exports.addIncome = addIncome;
exports.getAllIncome = getAllIncome;
exports.updateIncome = updateIncome;
exports.deleteIncome = deleteIncome;
exports.remaiderOfIncome = remaiderOfIncome;
exports.getIncome = getIncome;
