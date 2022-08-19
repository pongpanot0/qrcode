const swaggerAutogen = require('swagger-autogen')()
var fs = require("fs");
const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:7200',
  schemes: ['http'],
};
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const outputFile = './swagger_output.json'

fs.readdirSync("routes").forEach(function (file) {
if (file[0] == ".") return;

const endpointsFiles = ["./routes/" + 'auth.js',"./routes/" + 'buildingunit.js',"./routes/" + 'getapi.js',"./routes/" + 'room.js',"./routes/" + 'device.js',"./routes/"+'visitor.js']

swaggerAutogen(outputFile, endpointsFiles,doc)
});

