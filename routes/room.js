const room  = require('../controller/room')
module.exports = function (app) {
    app.post('/createRoom',room.createRoom)
    app.get('/getRoom/:company_id',room.getRoom)
}