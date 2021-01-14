var User = require("../models/user");

exports.createUser = (username, firstname, lastname, email, role) => {
  var newUser = new User(username, firstname, lastname, email, role);
  return newUser;
};
