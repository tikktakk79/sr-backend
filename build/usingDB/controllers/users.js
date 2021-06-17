"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _uuid = require("uuid");

var _db = _interopRequireDefault(require("../db"));

var _helper = _interopRequireDefault(require("./helper.js"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// const cryptoRandomString =  require("crypto-random-string")
var Str = require('@supercharge/strings');

var dotenv = require("dotenv");

var express = require('express');

dotenv.config("../../../.env");
var rand, mailOptions, host, link;
var User = {
  /**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  createUser: function createUser(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var hashPassword, removeDuplicate, createQuery, baseUrl, secretCode, values, rowsDuplicate, _yield$db$query, rows, _mailOptions;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("Entering create function");

              if (!(!req.body.password || !req.body.username || !req.body.email)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                message: "Alla fält är inte ifyllda"
              }));

            case 3:
              hashPassword = _helper["default"].hashPassword(req.body.password);
              removeDuplicate = "DELETE FROM anvandare\n      WHERE\n        status = 'pending'\n      AND\n        email = $1\n    ";
              createQuery = "INSERT INTO\n      anvandare (anvandarnamn, fornamn, efternamn, email, losenord, aktiveringskod)\n      VALUES ($1, $2, $3, $4, $5, $6)\n      returning *"; // const token = helper.generateToken(rows[0].anvandarnamn)
              // req.session.token = token
              // return res.status(201).send({ token })

              baseUrl = req.protocol + "://" + req.get("host");
              secretCode = _helper["default"].createVerificationToken(req.body.email);
              console.log("secret Code", secretCode);
              values = [req.body.username, req.body.firstname, req.body.lastname, req.body.email, hashPassword, //hashPassword
              secretCode];
              _context.prev = 10;
              _context.next = 13;
              return _db["default"].query(removeDuplicate, [values[3]]);

            case 13:
              rowsDuplicate = _context.sent;
              console.log("ROWSdupl", rowsDuplicate);
              _context.next = 20;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](10);
              console.log("Error in register db query", _context.t0);

            case 20:
              _context.prev = 20;
              console.log("Before create query in db");
              _context.next = 24;
              return _db["default"].query(createQuery, values);

            case 24:
              _yield$db$query = _context.sent;
              rows = _yield$db$query.rows;
              console.log("After create query");
              _context.prev = 27;
              _mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: req.body.email,
                subject: 'Confirm registration',
                text: "Anv\xE4nd f\xF6ljande l\xE4nk f\xF6r att aktivera ditt konto p\xE5 Radioskugga: ".concat(baseUrl, "/api/user/verification/verify-account/").concat(secretCode),
                html: "<p>Anv\xE4nd f\xF6ljande l\xE4nk f\xF6r att aktivera ditt konto p\xE5 Radioskugga: &nbsp;<strong></p><h3><a href=\"".concat(baseUrl, "/api/user/verification/verify-account/").concat(secretCode, "\" target=\"_blank\">Aktivera konto</a></strong></h3>")
              };
              console.log("Trying to send email");
              _context.next = 32;
              return _helper["default"].transporter.sendMail(_mailOptions, function (error, info) {
                if (error) {
                  console.log("Error sending mail", error);
                } else {
                  console.log('Email sent: ' + info.response);
                  return res.status(200).send();
                }
              });

            case 32:
              console.log("Mail sent");
              console.log("ROWS", rows);
              _context.next = 39;
              break;

            case 36:
              _context.prev = 36;
              _context.t1 = _context["catch"](27);
              console.log("Error in register db query", _context.t1);

            case 39:
              _context.next = 49;
              break;

            case 41:
              _context.prev = 41;
              _context.t2 = _context["catch"](20);
              console.log("rror routine", _context.t2.routine);
              console.log("Användarnamnet är upptaget");

              if (!(_context.t2.routine === "_bt_check_unique")) {
                _context.next = 47;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                message: "Username taken"
              }));

            case 47:
              console.log("Something failed and I don't know what!");
              return _context.abrupt("return", res.status(400).send(_context.t2));

            case 49:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[10, 17], [20, 41], [27, 36]]);
    }))();
  },

  /**
   * Login
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  loginUser: function loginUser(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var text, _yield$db$query2, rows, token;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log("HEj fron loginUser");

              if (!(!req.body.username || !req.body.password)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return", res.status(400).send({
                message: "Alla fält är inte ifyllda"
              }));

            case 3:
              console.log("111We got to here!");
              text = "SELECT * FROM anvandare WHERE anvandarnamn = $1";
              _context2.prev = 5;
              console.log("222We got to here!");
              _context2.next = 9;
              return _db["default"].query(text, [req.body.username]);

            case 9:
              _yield$db$query2 = _context2.sent;
              rows = _yield$db$query2.rows;
              console.log("Queryn funkade här kommer rows", rows);

              if (rows[0]) {
                _context2.next = 17;
                break;
              }

              res.statusMessage = "No match for user in database";
              return _context2.abrupt("return", res.status(400).send());

            case 17:
              if (!(rows[0].status !== "member")) {
                _context2.next = 20;
                break;
              }

              res.statusMessage = "User not verified";
              return _context2.abrupt("return", res.status(400).send());

            case 20:
              console.log("333We got to here!");
              console.log("Användarnamn stämmer");

              if (_helper["default"].comparePassword(rows[0].losenord, req.body.password)) {
                _context2.next = 26;
                break;
              }

              console.log("Compare pasword sket sig..");
              res.statusMessage = "Current password does not match";
              return _context2.abrupt("return", res.status(400).send());

            case 26:
              console.log("KOM enda hit");
              token = _helper["default"].generateToken(rows[0].anvandarnamn);
              return _context2.abrupt("return", res.status(200).send({
                token: token
              }));

            case 31:
              _context2.prev = 31;
              _context2.t0 = _context2["catch"](5);
              return _context2.abrupt("return", res.status(400).send(_context2.t0));

            case 34:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 31]]);
    }))();
  },

  /**
   * Delete A User
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  deleteUser: function deleteUser(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var deleteQuery, _yield$db$query3, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              deleteQuery = "DELETE FROM anvandare WHERE anvandarnamn=$1 returning *";
              _context3.prev = 1;
              _context3.next = 4;
              return _db["default"].query(deleteQuery, [req.body.username
              /* req.user.username */
              ]);

            case 4:
              _yield$db$query3 = _context3.sent;
              rows = _yield$db$query3.rows;

              if (rows[0]) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", res.status(404).send({
                message: "Användare hittades ej"
              }));

            case 8:
              return _context3.abrupt("return", res.status(204).send());

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](1);
              return _context3.abrupt("return", res.status(400).send(_context3.t0));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 11]]);
    }))();
  },
  updateUser: function updateUser(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var updateQuery;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              console.log("Running user update on backend");
              updateQuery = "UPDATE anvandare\n        SET (fornamn, efternamn, email) =\n        ($1, $2, $3)\n        WHERE anvandarnamn=$4 returning *";
              _context4.prev = 2;
              _context4.next = 5;
              return _db["default"].query(updateQuery, [req.body.firstname, req.body.lastname, req.body.email, req.user.username]);

            case 5:
              return _context4.abrupt("return", res.status(204).send());

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](2);
              return _context4.abrupt("return", res.status(400).send(_context4.t0));

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[2, 8]]);
    }))();
  },
  changePassword: function changePassword(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var text, _yield$db$query4, rows, passwordQuery, hashPassword;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              console.log("Username from changePassword:", req.user.username), console.log("New password:", req.body.newPassword);

              if (!(!req.body.password || !req.body.newPassword)) {
                _context5.next = 3;
                break;
              }

              return _context5.abrupt("return", res.status(400).send({
                message: "Alla fält är inte ifyllda"
              }));

            case 3:
              console.log("222We got to here!");
              text = "SELECT * FROM anvandare WHERE anvandarnamn = $1";
              _context5.prev = 5;
              _context5.next = 8;
              return _db["default"].query(text, [req.user.username]);

            case 8:
              _yield$db$query4 = _context5.sent;
              rows = _yield$db$query4.rows;
              console.log("Queryn funkade");

              if (rows[0]) {
                _context5.next = 13;
                break;
              }

              return _context5.abrupt("return", res.status(400).send({
                message: "Inloggningsuppgifterna du angav är felaktiga"
              }));

            case 13:
              console.log("333We got to here!");

              if (_helper["default"].comparePassword(rows[0].losenord, req.body.password)) {
                _context5.next = 17;
                break;
              }

              console.log("Compare pasword sket sig..");
              return _context5.abrupt("return", res.status(400).send({
                message: "badPassword"
              }));

            case 17:
              console.log("KOM enda hit, lösenordet stämmer");
              passwordQuery = "UPDATE anvandare\n          SET losenord = $1\n          WHERE anvandarnamn=$2";
              hashPassword = _helper["default"].hashPassword(req.body.newPassword);
              _context5.prev = 20;
              _context5.next = 23;
              return _db["default"].query(passwordQuery, [hashPassword, req.user.username]);

            case 23:
              console.log("Lösenord bytt");
              return _context5.abrupt("return", res.status(204).send());

            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](20);
              return _context5.abrupt("return", res.status(400).send(_context5.t0));

            case 30:
              _context5.next = 35;
              break;

            case 32:
              _context5.prev = 32;
              _context5.t1 = _context5["catch"](5);
              return _context5.abrupt("return", res.status(400).send(_context5.t1));

            case 35:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[5, 32], [20, 27]]);
    }))();
  },
  getUserData: function getUserData(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var createQuery, _yield$db$query5, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              createQuery = "SELECT anvandarnamn, fornamn, efternamn, email\n    FROM anvandare\n    WHERE anvandarnamn LIKE $1";
              _context6.prev = 1;
              _context6.next = 4;
              return _db["default"].query(createQuery, [req.user.username]);

            case 4:
              _yield$db$query5 = _context6.sent;
              rows = _yield$db$query5.rows;
              console.log("Username to use", req.user.username);
              console.log("USER data to send: ", rows);
              return _context6.abrupt("return", res.status(201).send(rows));

            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](1);
              return _context6.abrupt("return", res.status(400).send(_context6.t0));

            case 14:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[1, 11]]);
    }))();
  },
  searchUsers: function searchUsers(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var createQuery, username, firstname, lastname, email, values, _yield$db$query6, rows, rowsMod;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              console.log("Searching for users");
              createQuery = "SELECT anvandarnamn, hemligt FROM anvandare\n    WHERE\n      anvandarnamn ILIKE\n        $1\n   ";
              console.log("QUERY", req.query);
              console.log("QUERY FIRSTNAME", req.query.firstname);
              username = req.query.username || "";
              firstname = req.query.firstname || "";
              lastname = req.query.lastname || "";
              email = req.query.email || "";
              values = [username];
              console.log("VALUES", values);
              _context7.prev = 10;
              _context7.next = 13;
              return _db["default"].query(createQuery, values);

            case 13:
              _yield$db$query6 = _context7.sent;
              rows = _yield$db$query6.rows;
              console.log("Rows from searchUsers", rows);
              rowsMod = rows.filter(function (row) {
                return row.anvandarnamn !== req.user.username;
              });
              return _context7.abrupt("return", res.status(201).send(rowsMod));

            case 20:
              _context7.prev = 20;
              _context7.t0 = _context7["catch"](10);
              return _context7.abrupt("return", res.status(400).send(_context7.t0));

            case 23:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[10, 20]]);
    }))();
  },
  // #route:  GET /verification/verify-account
  // #desc:   Verify user's email address
  // #access: Public
  verifyAccount: function verifyAccount(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var decoded, updateUser, values, rows;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return _jsonwebtoken["default"].verify(req.params.secretCode, process.env.SECRET);

            case 3:
              decoded = _context8.sent;
              _context8.next = 10;
              break;

            case 6:
              _context8.prev = 6;
              _context8.t0 = _context8["catch"](0);
              return _context8.abrupt("return", res.sendFile("/Users/msberg/Vue/sr-backend/public/verification-jwt-fail.html"));

            case 10:
              updateUser = "\n      UPDATE anvandare\n      SET \n        aktiveringskod = null,\n        status = 'member'\n      WHERE\n        aktiveringskod = $1\n      AND\n        email = $2\n    ";
              values = [req.params.secretCode, decoded.email];
              _context8.prev = 12;
              _context8.next = 15;
              return _db["default"].query(updateUser, values);

            case 15:
              rows = _context8.sent;
              console.log("Rows from updateUser", rows);
              _context8.next = 23;
              break;

            case 19:
              _context8.prev = 19;
              _context8.t1 = _context8["catch"](12);
              console.log("Error on /api/auth/verification/verify-account: ", _context8.t1);
              return _context8.abrupt("return", res.sendFile("/Users/msberg/Vue/sr-backend/public/verification-success.html"));

            case 23:
              return _context8.abrupt("return", res.sendFile("/Users/msberg/Vue/sr-backend/public/verification-success.html"));

            case 24:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 6], [12, 19]]);
    }))();
  }
};
var _default = User;
exports["default"] = _default;