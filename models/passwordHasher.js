const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

exports.compareHash = async (enteredPassword, storedHash) => {
  try {
    //bcrypt will hash password as part of comparison
    return await bcrypt.compare(enteredPassword, storedHash);
  } catch (error) {
    console.log(error);
    return null;
  }
};

