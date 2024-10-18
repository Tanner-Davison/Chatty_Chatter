
const mongoose = require("mongoose");

const connectDb = async (key) => {
  try {
    await mongoose.connect(key);
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log("Error Connecting to MongoDB in db.js file", err.message);
  }
};

module.exports = connectDb;
