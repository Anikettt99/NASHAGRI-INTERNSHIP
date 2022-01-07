const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    console.log(`DataBase Connected Successfully`);
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

module.exports = connectDB;
