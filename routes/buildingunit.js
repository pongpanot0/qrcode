const building = require("../controller/buildingunit");
module.exports = function (app) {
  app.post("/createbuild", building.createbuild);
  app.get("/getbuild/:company_id", building.getbuildunit);
  app.get("/getonebuildunit/:id", building.getonebuildunit);
};
