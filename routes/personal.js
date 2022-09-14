const personal = require("../controller/personal");
var multer = require("multer");
const { v4: uuidv4 } = require("uuid");
  let uuid = uuidv4();
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, uuid + file.originalname.replaceAll(" ", ""));
  },
});

var upload = multer({ storage: storage }).single("avatar");
module.exports = function (app) {
  app.post("/createpersonal", personal.createpersonal);
  app.get("/getperson/:id", personal.getData);
  app.delete("/Deletepersonal/:id", personal.Deletepersonal);
  app.post("/importexcel", upload, personal.importexcel);
  app.post("/exportsperson/:company_id", personal.exportPerson);
  app.post("/DeleteManypersonal", personal.DeleteManypersonal);
  app.post("/updateManyUser", personal.updateManyUser);
  app.post("/updateUser/:id", personal.updateUser);
  app.get("/getUser/:id", personal.getUser);
  
};
