const express = require("express");
const {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
  remaiderOfIncome,
  getIncome,
} = require("../controller/income-controller");
const router = express.Router();

router.post("/add-income", addIncome);
router.get("/all-income", getAllIncome);
router.get("/get-income/:id", getIncome);
router.put("/update-income", updateIncome);
router.delete("/delete-income/:id", deleteIncome);
router.get("/remainder-income", remaiderOfIncome);

module.exports = router;
