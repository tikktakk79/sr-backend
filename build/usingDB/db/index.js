"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

const { Pool } = require('pg');

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/usingDB/models/index.js
_dotenv["default"].config();

const { parse } = require('pg-connection-string')

const config = parse(process.env.DATABASE_URL)

config.ssl = {
  rejectUnauthorized: false
}

const pool = new Pool(config)

pool.on("connect", function () {
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
      pool.query(text, params).then(function (res) {
        console.log("Tror det gick vägen");
        resolve(res);
      })["catch"](function (err) {
        reject(err);
      });
    });
  }
};
exports["default"] = _default;