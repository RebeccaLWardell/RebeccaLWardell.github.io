const { hash } = require("bcrypt");
const app = require("../app");
var ObjectId = require("mongodb").ObjectId;

//Check is a user's email is already registered
exports.checkUserRegistered = async (app, username) => {
    try {
      const queryResults = await app
        .set("hlmDb")
        .collection("users")
        .find({username: username})
        .toArray();
        var retrievedUser = queryResults[0].username
        return queryResults[0];
    } catch(error){
      console.log(`###Logged error: ${error}`);
      return false;
    }
  };
  
  //Write a new user to the database
  exports.addUser = async (app, user, hashedPassword) => {
    try{
      await app.set("hlmDb").collection("users").insertOne(
        {username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, password: hashedPassword, role: user.role}
        );
        } catch (error){
          console.error("Error adding user: "+error);
        }
    };

    exports.updateUser = async(app, username, firstname, lastname, email, role, hashedPassword) => {
      try{
        var myQuery = {username: username};
        var newValues = {$set: {firstname: firstname, lastname: lastname, email: email, password: hashedPassword, role: role}};
        await app
        .set("hlmDb")
        .collection("users")
        .updateOne(myQuery, newValues);
        return true;

      }catch(errer) {
        console.error("Error editing user: " + error);
        return false; 
      }

    };
  

      //Get the Hashed Password in the database for an email address
  exports.getHashForUsername = async(app, username) =>{
    try{
      const queryResults = await app
      .set("hlmDb")
      .collection("users")
      .find({ username: username })
      .toArray();
      return queryResults[0].password;
    } catch(error) {
      console.error(error);
    }
  };

  exports.getUserId = async(app, username) =>{
    try{
      const queryResults = await app
      .set("hlmDb")
      .collection("users")
      .find({ username: username  })
      .toArray();
      return queryResults[0]._id;
    } catch(error) {
      console.error("Error in retrieving id for user from db for username " + username);
      console.error(error);
    }
  };

  exports.getAllUsers = async(app) => {
    try{
      const usersResult = await app
      .set("hlmDb")
      .collection("users")
      .find()
      .toArray();
      return usersResult;
    }catch(error) {
      console.error(error);
    }
  };

  exports.getUserById = async(app, userId) => {
    try{
      const userDetails = await app
      .set("hlmDb")
      .collection("users")
      .findOne({ "_id": new ObjectId(userId)});
      return userDetails;
    }catch(error) {
      console.error(error);
    }
  };

