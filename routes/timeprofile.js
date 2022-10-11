const timeprofile = require("../controller/timeprofile");
module.exports = function (app) {
  app.post("/createtimeprofile", timeprofile.createTimeprofile);
  app.get("/getTimeprofile/:id", timeprofile.getTimeprofile);
  app.post("/edittimeprofile/:id", timeprofile.edittimeprofile);
  app.get("/getDetailprofile/:id", timeprofile.getDetail);
  app.get("/getline", timeprofile.getline);
  
};
