var movieModel = require("../models/Movies");
var globalData = require("../../config/config");
var Users = require("./../models/User");
var reviewModel = require("../models/Reviews");
var arraySort = require("array-sort");

// Adding Joi Import
const Joi = require("@hapi/joi");

var saveMovies = function (req, res) {
  // console.log(req.body);
  var recdata = req.body;
  var data = {
    name: recdata.name,
    genre: recdata.genre,
    release_date: recdata.release_date,
    up_votes: recdata.up_votes,
    down_votes: recdata.down_votes,
  };
  var schema = Joi.object().keys({
    name: Joi.string().required(),
    genre: Joi.string().required(),
    release_date: Joi.string().required(),
    up_votes: Joi.any().optional(),
    down_votes: Joi.any().optional(),
  });

  Joi.validate(data, schema, function (err, value) {
    if (err) {
      console.log(err);
      res.json({
        status: globalData.config.statusCode.error,
        error: err,
        message: "Validation errors!",
      });
    } else {
      var reviews = recdata.reviews;
      new movieModel.Movies(data)
        .save()
        .then(function (user) {
          let movie_id = user.toJSON().id;
          console.log(reviews);
          if (reviews.length > 0) {
            console.log("here");
            const finalReviewArray = reviews.map((obj) => ({
              ...obj,
              movie_id: movie_id,
              user_id: req.user.id,
            }));

            console.log("Check" + JSON.stringify(finalReviewArray));
            let multipleSaved =
              reviewModel.ReviewsCollection.forge(finalReviewArray);
            multipleSaved
              .invokeThen("save")
              .then(function () {
                res.json({
                  status: globalData.config.statusCode.success,
                  message: "SUCCESS",
                });
              })
              .catch(function (error) {
                console.log(error);
                res.json({
                  status: globalData.config.statusCode.error,
                  message: "Error",
                });
              });
          } else {
            res.json({
              status: globalData.config.statusCode.success,
              message: "SUCCESS",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          res.json({
            status: globalData.config.statusCode.error,
            message: "An error occured",
          });
        });
    }
  });
};

/* Get all movies */
var getMovies = function (req, res) {
  new movieModel.Movies()
    .fetchAll({
      withRelated: ["reviews"],
    })
    .then(function (users) {
      var moviesData = users.toJSON();
      console.log(moviesData);
      if (moviesData.length > 0) {
        if (req.query.vote && req.query.vote === "up_votes") {
          arraySort(moviesData, "up_votes");
        }
        if (req.query.vote && req.query.vote === "down_votes") {
          arraySort(moviesData, "down_votes");
        }
        if (req.query.release_date && req.query.release_date === "asc") {
          arraySort(moviesData, "release_date");
        }
        if (req.query.release_date && req.query.release_date === "desc") {
          arraySort(moviesData, "release_date", { reverse: true });
        }
        res.json({
          status: globalData.config.statusCode.success,
          message: "SUCCESS",
          data: moviesData,
        });
      } else {
        res.json({
          status: globalData.config.statusCode.success,
          message: "SUCCESS",
          data: [],
        });
      }
    })
    .catch(function (error) {
      console.log(error);
      res.json({
        status: globalData.config.statusCode.error,
        message: "FAIL",
        data: {},
      });
    });
};

/* Get movies by id */
var getMoviesById = function (req, res) {
  new movieModel.Movies()
    .where({ id: req.params.id })
    .fetch({
      withRelated: ["reviews"],
    })
    .then(function (users) {
      res.json({
        status: globalData.config.statusCode.success,
        message: "SUCCESS",
        data: users,
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
};

/* Get recommended movies */
var getRecommendedMovies = function (req, res) {
  new Users.User()
    .where({
      id: req.user.id,
    })
    .fetch()
    .then(function (users) {
      var userData = users.toJSON();
      if (userData) {
        // Compare Password
        new movieModel.Movies()
          .where({ genre: userData.favorite_genre })
          .fetchAll({
            withRelated: ["reviews"],
          })
          .then(function (users) {
            var moviesData = users.toJSON();
            console.log(moviesData);
            if (moviesData.length > 0) {
              res.json({
                status: globalData.config.statusCode.success,
                message: "SUCCESS",
                data: moviesData,
              });
            } else {
              res.json({
                status: globalData.config.statusCode.success,
                message: "SUCCESS",
                data: [],
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            res.json({
              status: globalData.config.statusCode.error,
              message: "FAIL",
              data: {},
            });
          });
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
};

var ratingMovies = function (req, res) {
  var data = req.body;
  var vote_type = data.vote_type;
  var movie_id = data.movie_id;
  new movieModel.Movies()
    .where({ id: movie_id })
    .fetch()
    .then(function (user) {
      let movieData = user.toJSON();
      if (movieData) {
        console.log(movieData);
        if (vote_type === "up_vote") {
          movieData.up_votes++;
        } else {
          movieData.down_votes++;
        }

        new movieModel.Movies()
          .where({ id: movie_id })
          .save(movieData, { patch: true })
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
      } else {
        res.json({
          status: globalData.config.statusCode.error,
          message: "Movie Not Found",
        });
      }
    })
    .catch(function (error) {
      console.log(error);
      res.json({
        status: globalData.config.statusCode.error,
        message: "FAIL",
        data: {},
      });
    });
};

/* Review Movies */
var reviewMovies = function (req, res) {
  var Data = {
    movie_id: req.body.movie_id,
    reviews: req.body.reviews,
    user_id: req.user.id,
  };
  
  var schema = Joi.object().keys({
    movie_id: Joi.any().required(),
    user_id: Joi.any().required(),
    reviews: Joi.string().required(),
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
        
  new reviewModel.Reviews(Data)
  .save()
  .then(function (user) {
    res.json({
      status: globalData.config.statusCode.success,
      message: "Review Added!",
      data: user,
    });
  })
  .catch(function (error) {
    console.log(error);
    res.json({
      status: globalData.config.statusCode.error,
      message: "Review cannot be added!",
    });
  });
    }
});

};

/* Exports all methods */
module.exports = {
  getMovies: getMovies,
  getMoviesById: getMoviesById,
  saveMovies: saveMovies,
  getRecommendedMovies: getRecommendedMovies,
  ratingMovies: ratingMovies,
  reviewMovies: reviewMovies,
};
