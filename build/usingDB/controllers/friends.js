"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../db"));

var _episode_list = _interopRequireDefault(require("./episode_list"));

var _helper = _interopRequireDefault(require("./helper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Friend = {
  addFriend: function addFriend(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var createQuery, createQuery2, values, rows;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              createQuery = "\n      CALL ny_van(?, ?);\n    ";
              createQuery2 = "\n      SELECT * FROM vanner WHERE \n        anvandare1 = LEAST(?, ?)\n      AND\n        anvandare2 = GREATEST(?, ?)\n      ;\n    ";
              values = [req.user.username, req.body.receiver, req.user.username, req.body.receiver];
              _context.prev = 3;
              _context.next = 6;
              return _db["default"].query(createQuery, values);

            case 6:
              _context.next = 8;
              return _db["default"].query(createQuery2, values);

            case 8:
              rows = _context.sent;
              console.log("rows2 from addFriend", rows);
              return _context.abrupt("return", res.status(200).send(rows));

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](3);
              console.log("NE DE gickk inte..");
              return _context.abrupt("return", res.status(400).send(_context.t0));

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 13]]);
    }))();
  },
  acceptFriend: function acceptFriend(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var createQuery, values;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log("Running acceept friend");
              console.log("acceptfriend user", req.user.username);
              console.log("acceptfriend receiver", req.body.receiver);
              createQuery = "\n      UPDATE vanner\n      SET godkann = null,\n      ny_fraga = false\n      WHERE (anvandare1 = ? AND anvandare2 = ?)\n        OR (anvandare2 = ? AND anvandare1 = ?)\n        AND godkann = ?\n    ";
              values = [req.user.username, req.body.receiver, req.user.username, req.body.receiver, req.user.username];
              _context2.prev = 5;
              _context2.next = 8;
              return _db["default"].query(createQuery, values);

            case 8:
              return _context2.abrupt("return", res.status(200).end());

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](5);
              return _context2.abrupt("return", res.status(400).send(_context2.t0));

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 11]]);
    }))();
  },
  waitFriend: function waitFriend(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var createQuery, values, _yield$db$query, rows, rowCount;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              createQuery = "\n      UPDATE vanner\n      SET ny_fraga = FALSE\n      WHERE anvandare1 = ?\n        OR anvandare2 = ?\n        AND godkann = ?\n    ";
              values = [req.user.username, req.body.receiver];
              _context3.prev = 2;
              _context3.next = 5;
              return _db["default"].query(createQuery, values);

            case 5:
              _yield$db$query = _context3.sent;
              rows = _yield$db$query.rows;
              rowCount = _yield$db$query.rowCount;
              return _context3.abrupt("return", res.status(200).end());

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](2);
              return _context3.abrupt("return", res.status(400).send(_context3.t0));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 11]]);
    }))();
  },
  listFriends: function listFriends(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var createQuery, values, rows, rowCount, friendsMod;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              console.log("Running list friends from backend");
              createQuery = "\n    SELECT\n      id, vanner.anvandare1, vanner.anvandare2, vanner.godkann, vanner.ny_fraga, anv1.fornamn AS fnamn1, anv1.efternamn AS enamn1, anv1.email AS email1, anv1.hemligt AS hemligt1, anv2.fornamn AS fnamn2, anv2.efternamn AS enamn2, anv2.email AS email2, anv2.hemligt AS hemligt2\n    FROM\n      vanner\n    JOIN\n      anvandare AS anv1\n    ON\n      anvandare1 = anvandarnamn\n    JOIN\n      anvandare AS anv2\n    ON\n      anvandare2 = anv2.anvandarnamn\n    WHERE\n      vanner.anvandare1 = ?\n    OR\n      vanner.anvandare2 = ?\n    ;\n    ";
              console.log("Önska mig lycka till innan jag försöker lista vännerna!");
              values = [req.user.username, req.user.username];
              _context4.prev = 4;
              _context4.next = 7;
              return _db["default"].query(createQuery, values);

            case 7:
              rows = _context4.sent;
              console.log("rows in listFriends", rows);
              rowCount = rows.length;
              console.log("RÖUUWS", rows);
              friendsMod = _helper["default"].userRelations(req.user.username, rows);
              return _context4.abrupt("return", res.status(200).send({
                friendsMod: friendsMod,
                rowCount: rowCount
              }));

            case 15:
              _context4.prev = 15;
              _context4.t0 = _context4["catch"](4);
              console.log("Error listing friends");
              return _context4.abrupt("return", res.status(400).send(_context4.t0));

            case 19:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[4, 15]]);
    }))();
  },
  deleteFriend: function deleteFriend(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var selectQuery, deleteQuery, rows;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              console.log("Running delete friend on backend");
              selectQuery = "\n    SELECT * FROM vanner\n      WHERE\n        anvandare1 LIKE LEAST(?, ?)\n      AND\n        anvandare2 LIKE GREATEST(?, ?)\n      ;\n    ";
              deleteQuery = "\n      DELETE FROM vanner\n        WHERE\n          anvandare1 LIKE LEAST(?, ?)\n        AND\n          anvandare2 LIKE GREATEST(?, ?)\n        ;\n      ";
              _context5.prev = 3;
              console.log("Mu uname", req.user.username);
              console.log("Other uname", req.body.receiver);
              _context5.next = 8;
              return _db["default"].query(selectQuery, [req.user.username, req.body.receiver, req.user.username, req.body.receiver]);

            case 8:
              rows = _context5.sent;

              if (rows[0]) {
                _context5.next = 11;
                break;
              }

              return _context5.abrupt("return", res.status(404).send({
                message: "friend relation not found"
              }));

            case 11:
              _context5.next = 13;
              return _db["default"].query(deleteQuery, [req.user.username, req.body.receiver, req.user.username, req.body.receiver]);

            case 13:
              return _context5.abrupt("return", res.status(204).send());

            case 16:
              _context5.prev = 16;
              _context5.t0 = _context5["catch"](3);
              return _context5.abrupt("return", res.status(400).send(_context5.t0));

            case 19:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[3, 16]]);
    }))();
  },
  setOld: function setOld(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var createQuery;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              createQuery = "\n      UPDATE vanner\n      SET\n        ny_fraga = FALSE\n      WHERE\n        godkann = ?\n    ";
              _context6.next = 3;
              return _db["default"].query(createQuery, [req.user.username]);

            case 3:
              _context6.prev = 3;
              return _context6.abrupt("return", res.status(204).end());

            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6["catch"](3);
              return _context6.abrupt("return", res.status(400).send(_context6.t0));

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[3, 7]]);
    }))();
  },
  getSecret: function getSecret(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var createQuery, _yield$db$query2, rows;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              createQuery = "\n      SELECT hemligt from anvandare\n      WHERE\n        anvandarnamn = ?\n    ";
              _context7.next = 3;
              return _db["default"].query(createQuery, [req.user.username]);

            case 3:
              _yield$db$query2 = _context7.sent;
              rows = _yield$db$query2.rows;
              _context7.prev = 5;
              console.log("Got hemligt from user in db", rows);
              return _context7.abrupt("return", res.status(200).send(rows));

            case 10:
              _context7.prev = 10;
              _context7.t0 = _context7["catch"](5);
              return _context7.abrupt("return", res.status(400).send(_context7.t0));

            case 13:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[5, 10]]);
    }))();
  },
  setSecret: function setSecret(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var createQuery;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              createQuery = "UPDATE anvandare\n    SET\n      hemligt = ?\n    WHERE\n      anvandarnamn = ?\n    ";
              console.log("SECRET from backend", req.body.secret);
              _context8.next = 4;
              return _db["default"].query(createQuery, [req.body.secret, req.user.username]);

            case 4:
              _context8.prev = 4;
              console.log("Set hemligt");
              return _context8.abrupt("return", res.status(200).end());

            case 9:
              _context8.prev = 9;
              _context8.t0 = _context8["catch"](4);
              return _context8.abrupt("return", res.status(400).send(_context8.t0));

            case 12:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[4, 9]]);
    }))();
  },
  getTipsMail: function getTipsMail(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
      var createQuery, rows;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              createQuery = "\n      SELECT tips_mail from anvandare\n      WHERE\n        anvandarnamn = ?\n    ";
              _context9.next = 3;
              return _db["default"].query(createQuery, [req.user.username]);

            case 3:
              rows = _context9.sent;
              _context9.prev = 4;
              console.log("Got tips_mail from user in db", rows);
              return _context9.abrupt("return", res.status(200).send(rows));

            case 9:
              _context9.prev = 9;
              _context9.t0 = _context9["catch"](4);
              return _context9.abrupt("return", res.status(400).send(_context9.t0));

            case 12:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[4, 9]]);
    }))();
  },
  setTipsMail: function setTipsMail(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      var createQuery;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              createQuery = "UPDATE anvandare\n    SET\n      tips_mail = ?\n    WHERE\n      anvandarnamn = ?\n    ";
              console.log("TipsMail from backend", req.body.tips_mail);
              _context10.next = 4;
              return _db["default"].query(createQuery, [req.body.tips_mail, req.user.username]);

            case 4:
              _context10.prev = 4;
              console.log("Set tipsMail");
              return _context10.abrupt("return", res.status(200).end());

            case 9:
              _context10.prev = 9;
              _context10.t0 = _context10["catch"](4);
              return _context10.abrupt("return", res.status(400).send(_context10.t0));

            case 12:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, null, [[4, 9]]);
    }))();
  },
  program: function program(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
      var permission, request;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              console.log("req.body", req.body);
              _context11.next = 3;
              return _helper["default"].permissionFriend(_db["default"], req);

            case 3:
              permission = _context11.sent;

              if (permission) {
                _context11.next = 6;
                break;
              }

              return _context11.abrupt("return", res.status(400));

            case 6:
              request = _objectSpread({}, req);
              request.user.username = req.body.username;
              console.log("Permission granted to send friend programs");

              _episode_list["default"].getPrograms(request, res);

            case 10:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }))();
  },
  episode: function episode(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
      var permission, request;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              console.log("req.body", req.body);
              _context12.next = 3;
              return _helper["default"].permissionFriend(_db["default"], req);

            case 3:
              permission = _context12.sent;

              if (permission) {
                _context12.next = 6;
                break;
              }

              return _context12.abrupt("return", res.status(400));

            case 6:
              console.log("Permission granted to send friend episodes");
              request = _objectSpread({}, req);
              request.user.username = req.body.username;

              _episode_list["default"].listEpisodes(request, res);

            case 10:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }))();
  }
};
var _default = Friend;
exports["default"] = _default;