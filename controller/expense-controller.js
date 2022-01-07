const HttpError = require("../model/http-error");
const Expense = require("../model/Expense");
const mongoose = require("mongoose");

const addExpense = async (req, res, next) => {
  const { details, amount, type, status, date } = req.body;
  if (!details || !amount || !type || !status || !date) {
    const error = new HttpError("PLEASE INPUT ALL FIELD", 500);
    return next(error);
  }
  let newExpense;
  try {
    newExpense = await Expense.create({
      details,
      amount,
      type,
      status,
      date,
      user: req.userId,
    });
  } catch (err) {
    const error = new HttpError("UNKNOWN ERROR", 404);
    return next(error);
  }
  res.status(201).json({
    message: "Expense Added Successfully",
  });
};

const getLatestExpense = async (req, res, next) => {
  let latestExpenses;
  try {
    latestExpenses = await Expense.find().sort({ date: -1 }).limit(5);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  res.status(201).json({
    latestExpenses,
  });
};

const getExpense = async (req, res, next) => {
  const id = req.params.id;

  let expense;
  try {
    expense = await Expense.findById(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if(!expense)
  {
    const error = new HttpError("NO DATA FOUND", 404);
    return next(error);
  }

  if (expense.user.toString() !== req.userId) {
    const error = new HttpError("YOU ARE NOT AUTHENTICATED", 500);
    return next(error);
  }

  res.status(201).json({
    expense,
  });
};

const updateExpense = async (req, res, next) => {
  const { id, details, amount, type, status } = req.body;
  if (!id || !details || !amount || !type || !status) {
    const error = new HttpError("INVALID FIELDS", 500);
    return next(error);
  }
  let expense;
  try {
    expense = await Expense.findById(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!expense) {
    const error = new HttpError("NO DATA FOUND", 500);
    return next(error);
  }

  if (expense.user.toString() !== req.userId) {
    const error = new HttpError("YOU ARE NOT AUTHENTICATED", 500);
    return next(error);
  }

  expense.details = details;
  expense.amount = amount;
  expense.type = type;
  expense.status = status;

  try {
    await expense.save();
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  res.status(201).json({
    message: "UPDATED SUCCESSFULLY",
  });
};

const deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  let expense;
  try {
    expense = await Expense.findById(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!expense) {
    const error = new HttpError("NO DATA FOUND", 500);
    return next(error);
  }

  if (expense.user.toString() !== req.userId) {
    const error = new HttpError("YOU ARE NOT AUTHENTICATED", 500);
    return next(error);
  }

  try {
    await Expense.findByIdAndRemove(id);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  res.status(201).json({
    message: "DELETED SUCCESSFULLY",
  });
};

const getAllExpense = async (req, res, next) => {
  const userId = req.userId;
  let allExpenses;
  try {
    allExpenses = await Expense.find({ user: userId });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  res.status(201).json({ allExpenses });
};

const reminderOfPayment = async (req, res, next) => {
  const userId = req.userId;
  let all_expenses;
  try {
    all_expenses = await Expense.find({ user: userId, status: "NOT PAID" });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  let to_be_paid = [];
  let overdue = [];
  const n = all_expenses.length;

  for (let i = 0; i < n; i++) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const day1 = new Date(Date.now());
    const day2 = all_expenses[i].date;
    const utc1 = Date.UTC(day1.getFullYear(), day1.getMonth(), day1.getDate());
    const utc2 = Date.UTC(day2.getFullYear(), day2.getMonth(), day2.getDate());
    const difference = Math.floor((utc2 - utc1) / MS_PER_DAY);

    if (difference <= 3 && difference >= 0) {
      const expense = all_expenses[i].toObject();
      expense.to_be_paid_in = difference;
      to_be_paid.push(expense);
    }
    if (difference < 0) {
      const expense = all_expenses[i].toObject();
      expense.over_due_by = -difference;
      overdue.push(expense);
    }
  }

  res.status(201).json({
    to_be_paid,
    overdue,
  });
};

exports.addExpense = addExpense;
exports.getLatestExpense = getLatestExpense;
exports.getExpense = getExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
exports.getAllExpense = getAllExpense;
exports.reminderOfPayment = reminderOfPayment;
