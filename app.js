//Entry point for  application
//Import express, path & routes
const express = require("express");
const path = require("path");


const controllers = require("./controllers/index");
//Initialise the app
const app = express();

// for post on form
app.use(express.urlencoded({ extended: false }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// sessions
const session = require("express-session");
// connect-mongo to store session in the db
const MongoStore = require("connect-mongo")(session);


// Basic usage
app.use(
  session({
    secret: "thisSecret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      url: 'mongodb://localhost:27017',
      ttl: 14 * 24 * 60 * 60, //= 14 Days. Default. Session expiration
      autoRemove: 'native' //Removes expired sessions
    })
  })
);
// middleware to make 'email' available to all templates
//Note to self for future reference: this should probably be in app.js, but I'm not changing it now
//in case I break something- JW
app.use(function(req, res, next) {
  if(req.session.login !== undefined){
    res.locals.login = req.session.login;
    res.locals.user = req.session.user;
    res.locals.role = req.session.role;
  } else{
    res.locals.login = false;
  }
  next();
});



//Define View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Define directory for static resources and controllers
app.use(express.static("./public"));
app.use("/", controllers());


//Configure database
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb://localhost:27017",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    app.set("hlmDb", client.db("hlmWeb"));
  }
);

//This needs to the be last path resolved
app.use(function(req,res,next){
  res.status(404).render("404",{
    title: "404"
  });
});

//Configure server to run on port 3000
app.listen(3000);

console.log("Express on 3000");
//Export and run app
module.exports = app;