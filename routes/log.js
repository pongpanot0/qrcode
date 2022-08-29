const log = require('../controller/log')
module.exports = function (app) {
    app.get('/getlogs/:id',log.getlogs)

}