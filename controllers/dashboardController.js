//Import express
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//Import router from express
const router = express.Router();


module.exports = () => {

//GET- load Current Applications page
  router.get("/current-applications", (req, res) => {
    res.render("currentapplications");
  });


//GET- load Sites with plnning granted page
router.get("/planning-granted", (req, res) => {
    res.render("siteswithplanninggranted");
  });

//GET- load Sites with plnning minded page
router.get("/planning-minded", (req, res) => {
    res.render("siteswithplanningminded");
  });


//GET- load Sites with plnning minded page
router.get("/retained-interest", (req, res) => {
    res.render("retainedinterest");
  });
  
//GET- load H&S next 30 days page
router.get("/health-safety-30days", (req, res) => {
    res.render("h&snext30days");
  });

 
    return router;
}