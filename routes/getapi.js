const getapi  = require('../controller/getapi')
module.exports = function (app) {
    app.get('/getdevice',getapi.getdevice)
    app.get('/opendoorwithapp',getapi.opendoorwithapp)
    app.get('/createqrcodevisitor',getapi.createqrcodevisitor)
    app.get('/createqrcodeemployee',getapi.createqrcodeemployee)
    app.get('/getcommunity/:company_id',getapi.getcommunity)
    

}