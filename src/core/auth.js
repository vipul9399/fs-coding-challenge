var jwt = require("jsonwebtoken");
var globalData = require("../config/config");

module.exports = {
  ensureAuthorized: function (req, res, next) {
    var self = this;
    var bearerToken;
    var bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      bearerToken = bearerHeader.replace("Bearer ", "");
      req.token = bearerToken;
      console.log(req.token);
      jwt.verify(
        bearerToken,
        "todo-app-super-shared-secret",
        function (err, decoded) {
          if (err) {
            res.json({
              status: globalData.config.statusCode.authErr,
              error: err,
              message: "Invalid Token!",
            });
          } else {
            req.user = decoded;
            if (typeof req.user != "undefined") {
              next();
            }
          }
        }
      );
    } else {
      res.json({
        status: globalData.config.statusCode.authErr,
        message: "Token not found!",
      });
    }
  },
};
