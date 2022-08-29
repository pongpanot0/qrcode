const visitor  = require('../controller/visiitor')
module.exports = function (app) {
    app.post('/createVisitor/:id',visitor.createVisitor)
    app.get('/getVisitor/:id',visitor.getVisitor)
    app.get('/getVisitorId/:id',visitor.getVisitorId)
    app.post('/exportsvisitor/:id',visitor.exportsvisitor)
}