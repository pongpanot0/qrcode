const department = require("../controller/department");
module.exports = function (app) {
  app.post("/createdepartment", department.createdepartment);
  app.get("/getdepartment/:id", department.getdepartment);
  app.get("/getdepartmentdetail/:id", department.getdepartmentdetail);
  app.get("/getdepartgetData/:id", department.getData);
  app.get("/getdepartmentdetaildata/:id", department.getdepartmentdetaildata);
  app.post("/inserttodepartment", department.inserttodepartment);
  app.post("/deleteoutdepartment", department.deleteoutdepartment);
  app.post("/editdepartment", department.editdepartment);
  
};
