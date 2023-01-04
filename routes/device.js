const device = require("../controller/device");
module.exports = function (app) {
  app.get("/getdeviceuuid/:company_id", device.getDevice);
  app.get("/getdeviceuuidmobile/:uuid", device.getDeviceuuid);
  
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
  app.post("/removemanyDevice/:company_id", device.removemanyDevice);
  app.post("/exportslogdevicewithdate/:company_id/:startDateTime/:endDateTime", device.exportslogdevicewithdate);
  app.post("/restartDevice/:company_id/:devSn", device.restartDevice);
  app.post("/editDevice/:id/:company_id", device.editDevice);
  app.get("/getoneDevice/:id/:company_id", device.getoneDevice);
  
  
};
