const express = require("express");
const {
  addExpense,
  getLatestExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getAllExpense,
  reminderOfPayment,
} = require("../controller/expense-controller");
const router = express.Router();

router.get("/all-expenses", getAllExpense);
router.get("/latest-expenses", getLatestExpense);
router.post("/add-expense", addExpense);
router.get("/getExpense/:id", getExpense);
router.put("/update-expense", updateExpense);
router.delete("/delete-expense/:id", deleteExpense);
router.get("/reminder_of_payment", reminderOfPayment);

module.exports = router;
