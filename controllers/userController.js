//Import express
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//Import router from express
const router = express.Router();
const userRepo = require("../models/userRepo");
var validator = require("../models/validator");
var passwordHasher = require("../models/passwordHasher");
var userFactory = require("../models/userFactory");


module.exports = () => {
  //GET- load add user page
  router.get("/adduser", (req, res) => {
    if(req.session.role != "Admin") {
      res.redirect("/");
    } else {
    res.render("adduser");
    }
  });

  //POST- Register a new user
  router.post("/adduser", urlencodedParser, async (req, res) => {
    if(req.session.role != "Admin") {
      res.redirect("/");
    } else {
    var userRegistered = await userRepo.checkUserRegistered(
      req.app,
      req.body.username
    );
    if (userRegistered == true) {
      res.render("adduser", {
        errorMessage: "That username already exists, please try again.",
      });
    } else {
      var password = req.body.pwd;
      //server-side password validation
      if (
        !validator.validatePassword(password) ||
        !validator.confirmPasswordsMatch(password, req.body.pwdConf)
      ) {
        res.render("adduser", {
          errorMessage: "Invalid password. Please try again.",
        });
      } else {
        //Hash password
        var hashedPassword = passwordHasher.hashPassword(password);
        var newUser = userFactory.createUser(
          req.body.username,
          req.body.fname,
          req.body.lname,
          req.body.email,
          req.body.role
        );
        await userRepo.addUser(req.app, newUser, hashedPassword);
        res.render("dashboard", {        
        });
      }
    }
  }
  });


  //GET- load view users page
  router.get("/users", urlencodedParser, async(req, res) => {
    if(req.session.role != "Admin") {
      res.redirect("/");
    } else {
      var allUsers = await userRepo.getAllUsers(req.app);
    res.render("viewusers", {
      title: "Users",
      allUsers: allUsers
    });      
    }    
  });

  // GET- Gets user Details and Loads user details page
  //TODO: get password decrypted. 
  router.get("/userDetails", async(req,res) => {
    if(req.session.role != "Admin") {
      res.redirect("/");
    } else {
    var user = await userRepo.getUserById(req.app, req.query.userId);
    if(user != null) {
      res.render("userdetails", {
        title: user.username,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,    
        password: "Thelimes100!",
        role: user.role     
      });
    }else{
      res.render("404");
    }
  }
  });



  router.post("/editUser", urlencodedParser, async (req, res) => {
    if(req.session.role != "Admin") {
      res.redirect("/");
    } else {
    var password = req.body.pwd;
    if (
      !validator.validatePassword(password) ||
      !validator.confirmPasswordsMatch(password, req.body.pwdConf)
    ) {
      res.render("editUser", {
        errorMessage: "Invalid password. Please try again.",
      });
    } else {
      console.log(password);
      //Hash password
      var hashedPassword = passwordHasher.hashPassword(password);
      console.log(hashedPassword);
      var updateSuccess = await userRepo.updateUser(req.app, 
        req.body.username,
        req.body.fname,
        req.body.lname,
        req.body.email,
        hashedPassword
        );

      if (updateSuccess == true) {
        res.redirect("/users");
      }
    }
  }
});


  //POST- Log in a user
  router.post("/login", urlencodedParser, async (req, res) => {
    var userRegistered = await userRepo.checkUserRegistered(
      req.app,
      req.body.username
    );
    if (!userRegistered) {
      res.render("login", {
        title: "Login",
        errorMessage: "Account not found, please try again.",
      });
    } else {
      var storedHash = await userRepo.getHashForUsername(
        req.app,
        req.body.username
      );
      var passwordsMatch = await passwordHasher.compareHash(
        req.body.pwd,
        storedHash
      );
      if (passwordsMatch) {
        var session = req.session;
        session.login="user";
        session.user = userRegistered;
        session.role = userRegistered.role;
        session.name = userRegistered.firstname;
        var cookieUserId = await userRepo.getUserId(req.app, req.body.username);;
        res.cookie("cookieUserId", cookieUserId);
        //redirect to "/", don't render it, as there's already a router for that
        res.redirect("/");
      } else {
        res.render("login", {
          title: "Login",
          errorMessage: "Incorrect login details, please try again",
        });
      }
    }
  });

  //GET- load login page
  router.get("/login", (req, res) => {
    res.render("login");
  });

  //Get- redirects to login once logged out
  router.get("/logout", (req, res) => {
    res.clearCookie("cookieUserId");
    req.session.destroy(function (err) {
      res.redirect("/login");
    });
  });


  return router;
}