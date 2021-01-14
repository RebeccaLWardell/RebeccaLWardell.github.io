//Import express
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//Import router from express
const router = express.Router();

module.exports = () => {

 //GET- load account page
  router.get("/accounts", (req, res) => {
    res.render("accountsfinance");
});

return router;
}