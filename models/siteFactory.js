var Site = require("../models/site");

exports.createSite = (siteName, region, plotName, owner, ha, offerDesc, status) => {
  var newSite = new Site(siteName, region, plotName, owner, ha, offerDesc, status);
  return newSite;
};