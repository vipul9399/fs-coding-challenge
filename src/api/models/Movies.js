var bookshelf = require("../../config/db").bookshelf;
var Reviews = require("./Reviews").Reviews;

var Movies = bookshelf.Model.extend({
  tableName: "movies",
  reviews: function () {
    return this.hasMany(Reviews, "movie_id", "id");
  },
});

module.exports = {
  Movies: Movies,
};
