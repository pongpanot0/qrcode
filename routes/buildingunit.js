const building = require("../controller/buildingunit");
module.exports = function (app) {
  app.post("/createbuild/:company_id", building.createbuild);
  app.get("/getbuild/:company_id", building.getbuildunit);
  app.get("/getonebuildunit/:company_id/:uuids", building.getonebuildunit);
  app.delete("/deletebuilding/:id/:uuid", building.deletebuilding);
  
};
