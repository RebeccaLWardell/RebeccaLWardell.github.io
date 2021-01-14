const express = require("express");
//Import router from express
const router = express.Router();

//Import the other controllers being used in this application
const userController = require("./userController");
const siteController = require("./siteController");
const accountController = require("./accountController");
const reportController = require("./reportController");
const dashboardController = require("./dashboardController");


//Router.use must be passed a middleware function, therefore it must call an object
//which returns a function which returns a router
//Pass the controller into the router
router.use(userController());
router.use(siteController());
router.use(accountController());
router.use(reportController());
router.use(dashboardController());

//Define default behaviour for "/"
module.exports = () => {
  router.get("/", async(req, res) => {
    if(req.session.login != "user") {
      res.redirect("/login");
    } else {
      return res.render("dashboard", {
        name: req.session.name
      });
    }
  });

  return router;
};