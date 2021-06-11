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
      var token, decoded, text, _yield$db$query, rows;

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
              _context.next = 6;
              return _jsonwebtoken["default"].verify(token, process.env.SECRET);

            case 6:
              decoded = _context.sent;
              text = "SELECT * FROM anvandare WHERE anvandarnamn = $1";
              _context.next = 10;
              return _db["default"].query(text, [decoded.username]);

            case 10:
              _yield$db$query = _context.sent;
              rows = _yield$db$query.rows;

              if (rows[0]) {
                _context.next = 15;
                break;
              }

              console.log("INVALID TOKEN PROVIDED!!!");
              return _context.abrupt("return", res.status(401).send({
                message: "The token you provided is invalid"
              }));

            case 15:
              req.user = {
                username: decoded.username
              };
              next();
              _context.next = 23;
              break;

            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](3);
              console.log("Some unidentified error in token verification");
              return _context.abrupt("return", res.status(400).send(_context.t0));

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 19]]);
    }))();
  }
};
var _default = Auth;
exports["default"] = _default;