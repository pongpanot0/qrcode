var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var multer = require("multer");
require("dotenv").config();
var upload = multer();
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
const db = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(function (req, res, next) {
  next();
});

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(upload.array());
fs.readdirSync("routes").forEach(function (file) {
  if (file[0] == ".") return;
  var routeName = file.substr(0, file.indexOf("."));
  require("./routes/" + routeName)(app);
});
console.log(process.env.db_host);
console.log(process.env.db_database);
app.listen(7200, () => {
  console.log("server start ");
});
