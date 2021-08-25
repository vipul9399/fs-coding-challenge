var DBConfig = {};

    DBConfig = {
      client: "mysql",
      connection: {
        host: "localhost",
        user: "cyborg",
        password: "Support@888",
        database: "challenge-assignment",
        charset: "utf8",
        debug: ["ComQueryPacket"]
      },
      pool: { min: 0, max: 7 }
    };

var knex = require("knex")(DBConfig);
var bookshelf = require("bookshelf")(knex);
module.exports.bookshelf = bookshelf;
