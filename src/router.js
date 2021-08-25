var user = require("./api/routes/users");
var crypto = require("./core/auth");
var movies = require("./api/routes/movies");

module.exports = function (app) {
  app.post("/api/user/login", user.login);
  app.post("/api/user/register", user.newUser);
  app.post("/api/user/updategenre", crypto.ensureAuthorized, user.updateGenre);

  // Movies Routes
  app.get("/api/movies", movies.getMovies);
  app.get(
    "/api/movies/recommended",
    crypto.ensureAuthorized,
    movies.getRecommendedMovies
  );
  app.post("/api/movies/save", crypto.ensureAuthorized, movies.saveMovies);
  app.get("/api/movie/:id", crypto.ensureAuthorized, movies.getMoviesById);
  app.post("/api/movies/ratings", crypto.ensureAuthorized, movies.ratingMovies);
  app.post("/api/movies/review", crypto.ensureAuthorized, movies.reviewMovies);
};
