const device = require('../controller/device')
module.exports = function (app) {
    app.get('/getdeviceuuid/:company_id',device.getDevice)
    app.post('/createdevice/:company_id',device.createdevice)
    app.delete('/removeDevice/:company_id/:devSn',device.removeDevice)
}