const { User } = require("./Schemas"); // your User model
const bcrypt = require("bcrypt");

const authenticateUser = async (username, password) => {
  try {
    const userExist = await User.findOne({ username: username });
    if (userExist) {
      const passwordMatch = await bcrypt.compare(password, userExist.password);
      if (passwordMatch) {
        return userExist;
      } else {
        return "INVALID PASSWORD";
      }
    } else {
      return "USER NOT FOUND";
    }
  } catch (err) {
    console.log(err, "ERROR IS IN AUTH.JS");
    return "INTERNAL SERVER ERROR";
  }
};

module.exports = authenticateUser;
