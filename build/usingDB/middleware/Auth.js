"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  verifyToken: function verifyToken(req, res, next) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var token, decoded, text, rows;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              token = req.headers["x-access-token"];

              if (token) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", res.status(401).send({
                message: "Token is not provided"
              }));

            case 3:
              _context.prev = 3;
              console.log("verifying token");
              _context.next = 7;
              return _jsonwebtoken["default"].verify(token, process.env.SECRET);

            case 7:
              decoded = _context.sent;
              text = "SELECT * FROM anvandare WHERE anvandarnamn = ?";
              _context.next = 11;
              return _db["default"].query(text, [decoded.username]);

            case 11:
              rows = _context.sent;
              console.log("Token verification query worked");

              if (rows[0]) {
                _context.next = 16;
                break;
              }

              console.log("INVALID TOKEN PROVIDED!!!");
              return _context.abrupt("return", res.status(401).send({
                message: "The token you provided is invalid"
              }));

            case 16:
              req.user = {
                username: decoded.username
              };
              next();
              _context.next = 24;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](3);
              console.log("Some unidentified error in token verification");
              return _context.abrupt("return", res.status(400).send(_context.t0));

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 20]]);
    }))();
  }
};
var _default = Auth;
exports["default"] = _default;