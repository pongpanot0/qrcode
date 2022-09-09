const personal = require("../controller/personal");
module.exports = function (app) {
    app.post('/createpersonal',personal.createpersonal)
    app.get('/getperson/:id',personal.getData)
    app.delete('/Deletepersonal/:id',personal.Deletepersonal)
    
}