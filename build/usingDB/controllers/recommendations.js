"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Rec = {
  saveRec: function saveRec(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var createQuery, values;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              createQuery = "\n      INSERT INTO rekommendationer (tipsare, mottagare, beskrivning, avsnitt)\n      VALUES (?, ?, ?, ?)\n    ";
              values = [req.body.sender, req.body.receiver, req.body.description, req.body.episode];
              _context.prev = 2;
              _context.next = 5;
              return _db["default"].query(createQuery, values);

            case 5:
              return _context.abrupt("return", res.status(201).end());

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);
              return _context.abrupt("return", res.status(400).send(_context.t0));

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 8]]);
    }))();
  },
  listRecs: function listRecs(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var createQuery, values, rows;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              createQuery = "\n    SELECT avsnitt, tipsare FROM rekommendationer\n    WHERE\n      mottagare LIKE ?\n   ";
              values = [req.body.username];
              _context2.prev = 2;
              _context2.next = 5;
              return _db["default"].query(createQuery, values);

            case 5:
              rows = _context2.sent;
              return _context2.abrupt("return", res.status(200).send(rows));

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](2);
              return _context2.abrupt("return", res.status(400).send(_context2.t0));

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 9]]);
    }))();
  },
  deleteRec: function deleteRec(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var createQuery, values;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              createQuery = "\n      DELETE FROM rekommendationer\n      WHERE\n        mottagare = ?\n      AND\n        tipsare = ?\n      AND\n        avsnitt = ?\n    ";
              values = [req.body.receiver, req.body.sender, req.body.episode];
              _context3.prev = 2;
              _context3.next = 5;
              return _db["default"].query(createQuery, values);

            case 5:
              return _context3.abrupt("return", res.status(204).end());

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](2);
              return _context3.abrupt("return", res.status(400).send(_context3.t0));

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 8]]);
    }))();
  }
};
var _default = Rec;
exports["default"] = _default;