const express = require("express");
const multer = require("multer");
const cors = require("cors");
const HttpError = require("./model/http-error");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { protect } = require("./middleware/auth-middleware");

const authRouter = require("./routes/auth-routes");
const expenseRouter = require("./routes/expense-routes");
const incomeRouter = require("./routes/income-routes");

dotenv.config();
connectDB();
const app = express();
const upload = multer();

app.use(cors());
app.options("*", cors());

app.use("/auth", upload.array(), authRouter);
app.use("/expense", upload.array(), protect, expenseRouter);
app.use("/income", upload.array(), protect, incomeRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
 // console.log(error);
  res.status(error.code || 500);
  res.json({ error: error.message || "An Unknown error occured" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`App listening on PORT ${PORT}`));
