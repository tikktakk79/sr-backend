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

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// const cryptoRandomString =  require("crypto-random-string")
var Str = require('@supercharge/strings');

var dotenv = require("dotenv");

var express = require('express');

var path = require('path');

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
      var hashPassword, removeDuplicate, createQuery, chosenProtocol, host, baseUrl, secretCode, values, _mailOptions;

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
              removeDuplicate = "DELETE FROM anvandare\n      WHERE\n        status = 'pending'\n      AND\n        email = ?\n    ";
              createQuery = "INSERT INTO\n      anvandare (anvandarnamn, fornamn, efternamn, email, losenord, aktiveringskod)\n      VALUES (?, ?, ?, ?, ?, ?)\n      "; // const token = helper.generateToken(rows[0].anvandarnamn)
              // req.session.token = token
              // return res.status(201).send({ token })

              chosenProtocol = "https";
              host = req.get("host");

              if (host.includes("localhost")) {
                chosenProtocol = "http";
              }

              baseUrl = chosenProtocol + "://" + req.get("host");
              secretCode = _helper["default"].createVerificationToken(req.body.email);
              console.log("secret Code", secretCode);
              values = [req.body.username, req.body.firstname, req.body.lastname, req.body.email, hashPassword, //hashPassword
              secretCode];
              _context.prev = 13;
              _context.next = 16;
              return _db["default"].query(removeDuplicate, [values[3]]);

            case 16:
              _context.next = 21;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](13);
              console.log("Error in register db query", _context.t0);

            case 21:
              _context.prev = 21;
              console.log("Before create query in db");
              _context.next = 25;
              return _db["default"].query(createQuery, values);

            case 25:
              console.log("After create query");
              _context.prev = 26;
              _mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: req.body.email,
                subject: 'Confirm registration',
                text: "Anv\xE4nd f\xF6ljande l\xE4nk f\xF6r att aktivera ditt konto p\xE5 Radioskugga: ".concat(baseUrl, "/api/user/verification/verify-account/").concat(secretCode),
                html: "<p>Anv\xE4nd f\xF6ljande l\xE4nk f\xF6r att aktivera ditt konto p\xE5 Radioskugga: &nbsp;<strong></p><h3><a href=\"".concat(baseUrl, "/api/user/verification/verify-account/").concat(secretCode, "\" target=\"_blank\">Aktivera konto</a></strong></h3>")
              };
              console.log("Trying to send email");
              _context.next = 31;
              return _helper["default"].transporter.sendMail(_mailOptions, function (error, info) {
                if (error) {
                  console.log("Error sending mail", error);
                } else {
                  console.log('Email sent: ' + info.response);
                  return res.status(200).send();
                }
              });

            case 31:
              console.log("Mail sent");
              _context.next = 37;
              break;

            case 34:
              _context.prev = 34;
              _context.t1 = _context["catch"](26);
              console.log("Error in register db query", _context.t1);

            case 37:
              _context.next = 48;
              break;

            case 39:
              _context.prev = 39;
              _context.t2 = _context["catch"](21);
              console.log("ERROR in register", _context.t2);
              console.log("error routine", _context.t2.code);
              console.log("Användarnamnet är upptaget");

              if (!(_context.t2.code === "ER_DUP_ENTRY")) {
                _context.next = 46;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                message: "Username taken"
              }));

            case 46:
              console.log("Something failed and I don't know what!");
              return _context.abrupt("return", res.status(400).send(_context.t2));

            case 48:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[13, 18], [21, 39], [26, 34]]);
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
      var text, rows, errObj, _errObj, token;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log("HEj fron loginUser, proc env", process.env.NODE_ENV);

              if (!(!req.body.username || !req.body.password)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return", res.status(400).send({
                message: "Alla fält är inte ifyllda"
              }));

            case 3:
              console.log("1We got to here!");
              text = "SELECT * FROM anvandare WHERE anvandarnamn = ?";
              _context2.prev = 5;
              console.log("2We got to here!");
              console.log("AND HERE");
              console.log("UNAME", req.body.username);
              errObj = {};
              _context2.prev = 10;
              // rows = await db.query(text, [req.body.username])
              console.log("Query text", text);
              _context2.next = 14;
              return _db["default"].query(text, [req.body.username]);

            case 14:
              rows = _context2.sent;
              _context2.next = 20;
              break;

            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2["catch"](10);
              console.log("Error i login query", _context2.t0);

            case 20:
              console.log("Queryn funkade här kommer rows", rows);

              if (rows[0]) {
                _context2.next = 29;
                break;
              }

              console.log("No match for user in database");
              errObj = {
                statusText: "No match for user in database"
              };
              res.status(400);
              res.send(errObj);
              return _context2.abrupt("return");

            case 29:
              if (!(rows[0].status !== "member")) {
                _context2.next = 33;
                break;
              }

              errObj = {
                statusText: "User not verified"
              };
              res.status(400).send(errObj);
              return _context2.abrupt("return");

            case 33:
              console.log("333We got to here!");
              console.log("Användarnamn stämmer");

              if (_helper["default"].comparePassword(rows[0].losenord, req.body.password)) {
                _context2.next = 40;
                break;
              }

              console.log("Compare pasword sket sig..");
              _errObj = {
                statusText: "Current password does not match"
              };
              res.status(400).send(_errObj);
              return _context2.abrupt("return");

            case 40:
              console.log("KOM enda hit");
              token = _helper["default"].generateToken(rows[0].anvandarnamn);
              return _context2.abrupt("return", res.status(200).send({
                token: token
              }));

            case 45:
              _context2.prev = 45;
              _context2.t1 = _context2["catch"](5);
              console.log("ERROR", _context2.t1);
              return _context2.abrupt("return", res.status(400).send(_context2.t1));

            case 49:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 45], [10, 17]]);
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
      var selectQuery, deleteQuery, _yield$db$query, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              selectQuery = "SELECT * FROM anvandare WHERE anvandarnamn=?";
              deleteQuery = "DELETE FROM anvandare WHERE anvandarnamn=?";
              _context3.prev = 2;
              _context3.next = 5;
              return _db["default"].query(deleteQuery, [req.body.username
              /* req.user.username */
              ]);

            case 5:
              _yield$db$query = _context3.sent;
              rows = _yield$db$query.rows;

              if (rows[0]) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("return", res.status(404).send({
                message: "Användare hittades ej"
              }));

            case 9:
              _context3.next = 11;
              return _db["default"].query(deleteQuery, [req.body.username
              /* req.user.username */
              ]);

            case 11:
              return _context3.abrupt("return", res.status(204).send());

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](2);
              return _context3.abrupt("return", res.status(400).send(_context3.t0));

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 14]]);
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
              updateQuery = "UPDATE anvandare\n        SET (fornamn, efternamn, email) =\n        (?, ?, ?)\n        WHERE anvandarnamn=?";
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
      var text, rows, passwordQuery, hashPassword;
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
              text = "SELECT * FROM anvandare WHERE anvandarnamn = ?";
              _context5.prev = 5;
              _context5.next = 8;
              return _db["default"].query(text, [req.user.username]);

            case 8:
              rows = _context5.sent;
              console.log("Queryn funkade");

              if (rows[0]) {
                _context5.next = 12;
                break;
              }

              return _context5.abrupt("return", res.status(400).send({
                message: "Inloggningsuppgifterna du angav är felaktiga"
              }));

            case 12:
              console.log("333We got to here!");

              if (_helper["default"].comparePassword(rows[0].losenord, req.body.password)) {
                _context5.next = 16;
                break;
              }

              console.log("Compare pasword sket sig..");
              return _context5.abrupt("return", res.status(400).send({
                message: "badPassword"
              }));

            case 16:
              console.log("KOM enda hit, lösenordet stämmer");
              passwordQuery = "UPDATE anvandare\n          SET losenord = ?\n          WHERE anvandarnamn=?";
              hashPassword = _helper["default"].hashPassword(req.body.newPassword);
              _context5.prev = 19;
              _context5.next = 22;
              return _db["default"].query(passwordQuery, [hashPassword, req.user.username]);

            case 22:
              console.log("Lösenord bytt");
              return _context5.abrupt("return", res.status(204).send());

            case 26:
              _context5.prev = 26;
              _context5.t0 = _context5["catch"](19);
              return _context5.abrupt("return", res.status(400).send(_context5.t0));

            case 29:
              _context5.next = 34;
              break;

            case 31:
              _context5.prev = 31;
              _context5.t1 = _context5["catch"](5);
              return _context5.abrupt("return", res.status(400).send(_context5.t1));

            case 34:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[5, 31], [19, 26]]);
    }))();
  },
  getUserData: function getUserData(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var createQuery, rows;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              createQuery = "SELECT anvandarnamn, fornamn, efternamn, email\n    FROM anvandare\n    WHERE anvandarnamn LIKE ?";
              _context6.prev = 1;
              _context6.next = 4;
              return _db["default"].query(createQuery, [req.user.username]);

            case 4:
              rows = _context6.sent;
              console.log("Username to use", req.user.username);
              console.log("USER data to send: ", rows);
              return _context6.abrupt("return", res.status(201).send(rows));

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](1);
              return _context6.abrupt("return", res.status(400).send(_context6.t0));

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[1, 10]]);
    }))();
  },
  searchUsers: function searchUsers(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var createQuery, username, firstname, lastname, email, values, rows, rowsMod;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              console.log("Searching for users");
              createQuery = "SELECT anvandarnamn, hemligt FROM anvandare\n    WHERE\n      anvandarnamn LIKE\n        LOWER(?)\n   ";
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
              rows = _context7.sent;
              console.log("Rows from searchUsers", rows);
              rowsMod = rows.filter(function (row) {
                return row.anvandarnamn !== req.user.username;
              });
              return _context7.abrupt("return", res.status(201).send(rowsMod));

            case 19:
              _context7.prev = 19;
              _context7.t0 = _context7["catch"](10);
              return _context7.abrupt("return", res.status(400).send(_context7.t0));

            case 22:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[10, 19]]);
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
              console.log("Verifying account");
              _context8.prev = 1;
              _context8.next = 4;
              return _jsonwebtoken["default"].verify(req.params.secretCode, process.env.SECRET);

            case 4:
              decoded = _context8.sent;
              _context8.next = 11;
              break;

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8["catch"](1);
              console.log("Error on /api/user/verification/verify-account: jwt verification ", _context8.t0);
              return _context8.abrupt("return", res.sendFile("verification-jwt-fail.html", {
                root: path.join(__dirname, '../../../public')
              }));

            case 11:
              updateUser = "\n      UPDATE anvandare\n      SET \n        aktiveringskod = null,\n        status = 'member'\n      WHERE\n        aktiveringskod = ?\n      AND\n        email = ?\n    ";
              values = [req.params.secretCode, decoded.email];
              _context8.prev = 13;
              _context8.next = 16;
              return _db["default"].query(updateUser, values);

            case 16:
              rows = _context8.sent;
              console.log("Rows from updateUser", rows);
              _context8.next = 24;
              break;

            case 20:
              _context8.prev = 20;
              _context8.t1 = _context8["catch"](13);
              console.log("Error on /api/auth/verification/verify-account: ", _context8.t1);
              return _context8.abrupt("return", res.sendFile("verification-db-fail.html", {
                root: path.join(__dirname, '../../../public')
              }));

            case 24:
              console.log("Verification success");
              res.sendFile("verification-success.html", {
                root: path.join(__dirname, '../../../public')
              });

            case 26:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[1, 7], [13, 20]]);
    }))();
  }
};
var _default = User;
exports["default"] = _default;