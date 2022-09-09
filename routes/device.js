const device = require("../controller/device");
module.exports = function (app) {
  app.get("/getdeviceuuid/:company_id", device.getDevice);
  app.post("/createdevice/:company_id", device.createdevice);
  app.delete("/removeDevice/:company_id/:devSn", device.removeDevice);
  app.post("/getDevice/:company_id", device.exportsDevice);
  app.get("/getDeviceLenght/:company_id", device.getDeviceLenght);
  app.post("/openDevice/:company_id/:devSn", device.openDevice);
  app.post(
    "/ConfigDevice/:company_id/:devSn/:devAccSupperPassword",
    device.ConfigDevice
  );
  app.get("/getLogDevice/:company_id", device.getLogDevice);
  app.post("/exportslogdevice/:company_id", device.exportslogdevice);
  app.post("/creategroupdevice/:company_id", device.devicegroup);
  app.get("/getdevicegroup/:id", device.getdevicegroup);
  app.get("/getdevicegroupcompanyid/:id", device.getdevicegroupcompanyid);
  app.post("/deletepermisiion/:id", device.deletepermisiion);
  app.post("/addpermision", device.addpermision);
  app.post("/deletepermisiionuser/:id", device.deletepermisiionuser);

  
};
