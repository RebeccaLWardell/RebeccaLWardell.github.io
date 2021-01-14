const app = require("../app");
var ObjectId = require("mongodb").ObjectId;

//get all sites from Db
exports.getAllRegions = async(app) => {
    try{
      const regionsResult = await app
      .set("hlmDb")
      .collection("regions")
      .find()
      .toArray();
      return regionsResult;
    }catch(error) {
      console.error(error);
    }
  };