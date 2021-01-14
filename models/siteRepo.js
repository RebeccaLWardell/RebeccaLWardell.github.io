const app = require("../app");
var ObjectId = require("mongodb").ObjectId;

//Check if a site name already exists in Db
exports.checkIfSiteExists = async(app, siteName) => {
    try{
        const siteResults = await app
        .set("hlmDb")
        .collection("sites")
        .find({siteName: siteName})
        .toArray();
        return siteResults[0];
    }catch(error){
        return false;
    }

};

//Write a new site to the database
exports.addSite = async (app, site) => {
    try{
      await app
      .set("hlmDb")
      .collection("sites")
      .insertOne({sitename: site.siteName, region: site.region, plotName: site.plotName, owner: site.owner, ha: site.ha, offerdesc: site.offerDesc, status: site.status});
    } catch (error){
          console.error(`Error adding site: ${error}`);
        }
};

//get all sites from Db
exports.getAllSites = async(app) => {
    try{
      const sitesResult = await app
      .set("hlmDb")
      .collection("sites")
      .find()
      .toArray();
      return sitesResult;
    }catch(error) {
      console.error(error);
    }
  };

  exports.getSiteById= async(app, siteId) => {
    try{
        const siteDetails = await app
        .set("hlmDb")
        .collection("sites")
        .findOne({ "_id": new ObjectId(siteId)});
        return siteDetails;
      }catch(error) {
        console.error(error);
      }

  };
