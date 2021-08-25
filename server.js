var express = require("express");
var bodyParser = require("body-parser");
var appRoot = require("app-root-path");
var json2xls = require("json2xls");
var cors = require("cors");
const ipfilter = require("express-ipfilter").IpFilter;
// Whitelist the following IPs
const ips = ["127.0.0.1", "157.33.86.57"];

// Code to Create Server
var app = express();
app.use(cors());
app.use(json2xls.middleware);
app.use(bodyParser.json());

// V1 API Routes
require("./src/router")(app);
let portNo = 3000;

// Start Server
app.listen(portNo, "0.0.0.0", function() {
  console.log(
    process.env.NODE_ENV + " API started at localhost. Port:" + portNo
  );
});
