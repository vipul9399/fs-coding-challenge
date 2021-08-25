var Users = require("./../models/User");
var globalData = require("../../config/config");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

/* Get a user */
var login = function (req, res) {
  var Data = {
    username: req.body.username,
    password: req.body.password,
  };
  var resData = {
    token: "",
  };
  var array = [];
  if (Data.username === "") {
    res.json({
      status: globalData.config.statusCode.error,
      message: "Please enter Username!",
    });
  } else if (Data.password === "") {
    res.json({
      status: globalData.config.statusCode.error,
      message: "Please enter Password!",
    });
  } else {
    // Check if user exists
    new Users.User()
      .where({
        username: Data.username,
      })
      .fetch()
      .then(function (users) {
        var userData = users.toJSON();
        if (userData) {
          // Compare Password
          bcrypt.compare(
            Data.password,
            userData.password,
            function (err, result) {
              // res == true
              if (result === true) {
                var token = jwt.sign(
                  {
                    username: userData.username,
                    id: userData.id,
                  },
                  "todo-app-super-shared-secret",
                  {
                    expiresIn: "2h",
                  }
                );
                resData.token = token;
                res.json({
                  status: globalData.config.statusCode.success,
                  message: "Auth Success",
                  data: resData,
                });
              } else {
                res.json({
                  status: globalData.config.statusCode.error,
                  // message: "Auth Error: Password"
                  message: "Auth Error: Failed",
                });
              }
            }
          );
        } else {
          res.json({
            status: globalData.config.statusCode.error,
            // message: "Auth Error: Username"
            message: "Auth Error: Failed",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        res.json({
          status: globalData.config.statusCode.error,
          message: "Something Went Wrong. Please try again later!",
        });
      });
  }
};

/* Create new User */
var newUser = function (req, res) {
  var Data = {
    username: req.body.username,
    password: req.body.password,
  };

  var schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  Joi.validate(Data, schema, function (err, value) {
    if (err) {
      console.log(err);
      res.json({
        status: globalData.config.statusCode.error,
        error: err,
        message: "Validation errors!",
      });
    } else {
      new Users.User()
        .where({
          username: Data.username,
        })
        .fetchAll()
        .then(function (users) {
          var userData = users.toJSON();
          // console.log(userData);
          if (userData.length > 0) {
            res.json({
              status: globalData.config.statusCode.error,
              message: "Username already taken!",
            });
          } else {
            bcrypt.hash(Data.password, saltRounds, function (err, hash) {
              // Store hash in your password DB.
              var isAdmin = false;

              Data.password = hash;
              new Users.User(Data)
                .save()
                .then(function (user) {
                  res.json({
                    status: globalData.config.statusCode.success,
                    message: "User Created!",
                    data: user.toJSON().id,
                  });
                })
                .catch(function (error) {
                  console.log(error);
                  res.json({
                    status: globalData.config.statusCode.error,
                    message: "User Cannot be Created!",
                  });
                });
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          res.json({
            status: globalData.config.statusCode.error,
            message: "Something Went Wrong!",
          });
        });
    }
  });
};
/* Update Genre */
var updateGenre = function (req, res) {
  var data = req.body;
  var transactionData = {
    favorite_genre: data.favorite_genre,
  };
  
  var schema = Joi.object().keys({
    favorite_genre: Joi.string().required(),
  });
  
  Joi.validate(transactionData, schema, function (err, value) {
    if (err) {
      console.log(err);
      res.json({
        status: globalData.config.statusCode.error,
        error: err,
        message: "Validation errors!",
      });
    } else {
      
  new Users.User()
  .where({ id: req.user.id })
  .save(transactionData, { patch: true })
  .then(function (user) {
    res.json({
      status: globalData.config.statusCode.success,
      message: "SUCCESS",
      data: user.toJSON(),
    });
  })
  .catch(function (error) {
    console.log(error);
    res.json({
      status: globalData.config.statusCode.error,
      message: "FAIL",
      data: {},
    });
  });
    }
  });
};

/* Exports all methods */
module.exports = {
  login: login,
  newUser: newUser,
  updateGenre: updateGenre,
};
