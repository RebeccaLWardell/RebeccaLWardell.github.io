//Import express
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//Import router from express
const router = express.Router();

const siteRepo = require("../models/siteRepo");
var siteFactory = require("../models/siteFactory");
const regionRepo = require("../models/regionRepo");

module.exports = () => {

  //GET- load add site page
  router.get("/addsite", urlencodedParser, async (req, res) => {
    var regionList = await regionRepo.getAllRegions(req.app);
        res.render("addsite");
  });


  //POST- Add a New Site
  router.post("/addsite", urlencodedParser, async (req, res) => {
   
    var siteExists= await siteRepo.checkIfSiteExists(
      req.app,
      req.body.siteName
    );
    if (siteExists != null) {
      res.render("addsite", {
        errorMessage: "That site already exists, please try again.",
      });
    } else {
        var newSite = siteFactory.createSite(
            req.body.siteName,
            req.body.region,
            req.body.plotName,
            req.body.owner,
            req.body.ha,
            req.body.offerDesc,
            req.body.status
          );

        await siteRepo.addSite(req.app, newSite);
        res.render("addsite", {          
        });
    }
  });

  //GET- load view sites page
  router.get("/sites", urlencodedParser, async(req, res) => {
    var allSites = await siteRepo.getAllSites(req.app);
    res.render("sites", {
      title: "Sites",
      allSites: allSites
    });      
  });

  // GET- Gets site Details and Loads site details page
  router.get("/sitedetails", async(req,res) => {
    var site = await siteRepo.getSiteById(req.app, req.query.siteId);
    if(site != null) {
      res.render("sitedetails", {
        title: site.siteName,
        siteName: site.siteName,
        region: site.region,
        plotName: site.plotName,
        owner: site.owner,
        ha: site.ha,
        offerDesc: site.offerDesc,
        status: site.status
      });
    }else{
      res.render("404");
    }
  });



    return router;
}