"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword: function hashPassword(password) {
    return _bcrypt["default"].hashSync(password, _bcrypt["default"].genSaltSync(8));
  },

  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword: function comparePassword(hashPassword, password) {
    return _bcrypt["default"].compareSync(password, hashPassword);
  },

  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail: function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken: function generateToken(username) {
    console.log("Hello from generatToken! username is, ", username);

    var token = _jsonwebtoken["default"].sign({
      username: username
    }, process.env.SECRET, {
      expiresIn: "7d"
    });

    console.log("Hello AGAIN from generatToken!");
    return token;
  },
  createVerificationToken: function createVerificationToken(email) {
    var token = _jsonwebtoken["default"].sign({
      email: email
    }, process.env.SECRET, {
      expiresIn: 60 * 60
    });

    console.log("Hello AGAIN from generatToken!");
    return token;
  },
  userRelations: function userRelations(myUser, relations) {
    var friendsMod = [];
    relations.map(function (raw) {
      var friend = {};
      friend.id = raw.id;
      friend.ny_fraga = raw.ny_fraga;
      console.log("RAW", raw);

      if (raw.anvandare1 === myUser) {
        friend.username = raw.anvandare2;
        friend.fornamn = raw.fnamn2;
        friend.efternamn = raw.enamn2;
        friend.email = raw.email2;
        friend.hemligt = raw.hemligt2;
      } else {
        friend.username = raw.anvandare1;
        friend.fornamn = raw.fnamn1;
        friend.efternamn = raw.enamn1;
        friend.email = raw.email1;
        friend.hemligt = raw.hemligt1;
      }

      if (raw.godkann === myUser) {
        friend.godkann = "you";
      } else if (raw.godkann === friend.username) {
        friend.godkann = "waiting";
      } else {
        friend.godkann = null;
      }

      console.log("One iteration..");
      friendsMod.push(friend);
    });
    console.log("All iterations done");
    console.log("friensMod from helper method", friendsMod);
    return friendsMod;
  },
  permissionFriend: function permissionFriend(db, req) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var createQuery1, _yield$db$query, rows, createQuery2, rows2;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              createQuery1 = "\n      SELECT hemligt from anvandare \n      WHERE\n        anvandarnamn LIKE $1\n    ";
              _context.next = 3;
              return db.query(createQuery1, [req.body.username]);

            case 3:
              _yield$db$query = _context.sent;
              rows = _yield$db$query.rows;

              if (rows[0].hemligt) {
                _context.next = 8;
                break;
              }

              console.log("TRUE DAT");
              return _context.abrupt("return", true);

            case 8:
              createQuery2 = "\n    select * from vanner\n    where \n      (anvandare1 LIKE $1 AND anvandare2 LIKE $2)\n    OR \n      (anvandare2 LIKE $1 AND anvandare1 LIKE $2)\n    AND  \n      (godkann IS NULL OR godkann LIKE $1)\n    ";
              _context.next = 11;
              return db.query(createQuery2, [req.user.username, req.body.username]);

            case 11:
              rows2 = _context.sent;

              if (!rows2.rows.length) {
                _context.next = 15;
                break;
              }

              console.log("TRUE DAT");
              return _context.abrupt("return", true);

            case 15:
              console.log("FALSE DAT");
              return _context.abrupt("return", false);

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  transporter: _nodemailer["default"].createTransport({
    service: 'gmail',
    auth: {
      user: 'stellanurbansson@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  })
};
var _default = Helper;
exports["default"] = _default;