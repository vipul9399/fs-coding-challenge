var bookshelf = require("../../config/db").bookshelf;

var Reviews = bookshelf.Model.extend({
  tableName: "reviews",
});

var ReviewsCollection = bookshelf.Collection.extend({
  model: Reviews,
});

module.exports = {
  Reviews: Reviews,
  ReviewsCollection: ReviewsCollection,
};
