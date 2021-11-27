"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mysql = _interopRequireDefault(require("mysql2"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/usingDB/models/index.js
_dotenv["default"].config();

var poolObject = {
  connectionString: process.env.DATABASE_URL
};

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
  poolObject.ssl = {
    rejectUnauthorized: false
  };
}

var pool = _mysql["default"].createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

pool.on("connection", function () {
  console.log("connected to the db");
});
var _default = {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  query: function query(text, params) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, conn) {
        if (err) {
          console.log('query connec error!', err); // resolve(err);
        } else {
          conn.query(text, params, function (err, rows) {
            if (err) {
              console.log("Query failed", err);
              reject(err);
            } else {
              console.log("Query resolved", rows);
              resolve(rows);
              console.log("Code after resolve");
            }

            conn.release();
          });
        }
      });
    });
  }
};
exports["default"] = _default;