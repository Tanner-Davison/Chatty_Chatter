
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log("Error Connecting to MongoDB in db.js file", err.message);
  }
};

module.exports = connectDb;
