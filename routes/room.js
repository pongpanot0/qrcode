const room  = require('../controller/room')
module.exports = function (app) {
    app.post('/createRoom/:company_id',room.createRoom)
    app.get('/getRoom/:company_id',room.getRoom)
    app.delete('/deleteroom/:company_id/:uuids',room.deleteroom)
    app.get('/getoneRoom/:company_id/:uuids',room.getoneRoom)
    app.post('/exportsRoom/:company_id',room.exportsRoom)
    
}