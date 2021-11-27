"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../db"));

var _helper = _interopRequireDefault(require("./helper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Episode = {
  saveEpisode: function saveEpisode(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var createQuery, grade, values;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              createQuery = "\n      INSERT INTO sparade_avsnitt (anvandare, avsnitt, titel, program_namn, program_id, beskrivning, url, lyssningslank, pub_datum_utc, betyg)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ";
              grade = req.body.grade;
              console.log("GRADE:", grade);
              grade = parseInt(grade);

              if (!grade) {
                grade = null;
              }

              values = [req.user.username, req.body.episode_id, req.body.title, req.body.show_name, req.body.show_id, req.body.description, req.body.url, req.body.listen_link, req.body.pub_date, grade];
              console.log("GRADE", grade);
              _context.prev = 7;
              _context.next = 10;
              return _db["default"].query(createQuery, values);

            case 10:
              return _context.abrupt("return", res.status(201).end());

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](7);
              console.log("Error in saveEpisode", _context.t0);
              return _context.abrupt("return", res.status(400).send(_context.t0));

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[7, 13]]);
    }))();
  },
  gradeProgram: function gradeProgram(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var createQuery, grade, values;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              createQuery = "\n      INSERT INTO programbetyg (anvandare, programid, programnamn, betyg)\n      VALUES (?, ?, ?, ?)\n    ";
              grade = req.body.grade;
              console.log("GRADE:", grade);

              if (!!grade) {
                grade = parseInt(grade);
              }

              values = [req.user.username, req.body.program_id, req.body.program_name, grade];
              _context2.prev = 5;
              _context2.next = 8;
              return _db["default"].query(createQuery, values);

            case 8:
              console.log("Grade program worked");
              return _context2.abrupt("return", res.status(201).end());

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](5);

              if (_context2.t0.code === "23505") {
                console.log("Japp en 23505:a duplicate..");
              } else {
                console.log("Nä de va ingen duplicate");
              }

              console.log("Grade program didn't work", _context2.t0);
              return _context2.abrupt("return", res.status(400).send(_context2.t0));

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 12]]);
    }))();
  },
  updateProgram: function updateProgram(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var createQuery, grade, values;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              createQuery = "UPDATE programbetyg\n     SET betyg = ?\n     WHERE anvandare =?\n     AND programid = ?\n    ";
              grade = req.body.grade;

              if (!!grade) {
                grade = parseInt(grade);
              }

              values = [grade, req.user.username, req.body.program_id];
              _context3.prev = 4;
              _context3.next = 7;
              return _db["default"].query(createQuery, values);

            case 7:
              console.log("Update program worked");
              return _context3.abrupt("return", res.status(200).end());

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](4);
              console.log("Update program didn't work", _context3.t0);
              return _context3.abrupt("return", res.status(400).send(_context3.t0));

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[4, 11]]);
    }))();
  },
  deleteProgram: function deleteProgram(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var createQuery, values;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              createQuery = " DELETE  from programbetyg \n      WHERE anvandare \n        LIKE ?\n      AND \n        programid LIKE ?\n    ";
              values = [req.user.username, req.body.program_id];
              _context4.prev = 2;
              _context4.next = 5;
              return _db["default"].query(createQuery, values);

            case 5:
              console.log("Delete program worked and returned rows:");
              return _context4.abrupt("return", res.status(200).end());

            case 9:
              _context4.prev = 9;
              _context4.t0 = _context4["catch"](2);
              console.log("Delete program didn't work", _context4.t0);
              return _context4.abrupt("return", res.status(400).send(_context4.t0));

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[2, 9]]);
    }))();
  },
  getPrograms: function getPrograms(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var createQuery, values, rows;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              createQuery = "\n    SELECT * FROM programbetyg\n    WHERE\n      anvandare LIKE ?\n   ";
              console.log("USER data:", req.user);
              console.log("RUnning get programs in backend");
              values = [req.user.username];
              _context5.prev = 4;
              _context5.next = 7;
              return _db["default"].query(createQuery, values);

            case 7:
              rows = _context5.sent;
              console.log("Rows inside list programs", rows);
              console.log("Next, comparing betyg inside get Programs");
              console.log("Sparade program", rows);
              return _context5.abrupt("return", res.status(200).send(rows));

            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](4);
              console.log("Fel i get programs", _context5.t0);
              return _context5.abrupt("return", res.status(400).send(_context5.t0));

            case 18:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[4, 14]]);
    }))();
  },
  listEpisodes: function listEpisodes(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var createQuery, values, rows;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              createQuery = "\n    SELECT * FROM sparade_avsnitt\n    WHERE\n      anvandare LIKE ?\n    AND \n      tipsare IS NULL\n   ";
              console.log("USER data:", req.user);
              console.log("RUnning get episodes in backend");
              values = [req.user.username];
              _context6.prev = 4;
              _context6.next = 7;
              return _db["default"].query(createQuery, values);

            case 7:
              rows = _context6.sent;
              console.log("Rows inside list episodes", rows);
              console.log("Next, comparing betyg inside get Programs");
              console.log("Sparade avsnitt", rows);
              return _context6.abrupt("return", res.status(200).send(rows));

            case 14:
              _context6.prev = 14;
              _context6.t0 = _context6["catch"](4);
              console.log("Fel i get episodes", _context6.t0);
              return _context6.abrupt("return", res.status(400).send(_context6.t0));

            case 18:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[4, 14]]);
    }))();
  },
  deleteEpisode: function deleteEpisode(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var createQuery, values;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              createQuery = "\n      DELETE FROM sparade_avsnitt\n      WHERE\n        anvandare = ?\n      AND\n        avsnitt = ?\n    ";
              values = [req.user.username, req.body.episode_id];
              _context7.prev = 2;
              _context7.next = 5;
              return _db["default"].query(createQuery, values);

            case 5:
              return _context7.abrupt("return", res.status(200).end());

            case 8:
              _context7.prev = 8;
              _context7.t0 = _context7["catch"](2);
              return _context7.abrupt("return", res.status(400).send(_context7.t0));

            case 11:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[2, 8]]);
    }))();
  },
  setGrade: function setGrade(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var createQuery, values;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              console.log("Hello from setGrade in backend");
              createQuery = "\n    UPDATE sparade_avsnitt\n    SET betyg = ?\n    WHERE\n      anvandare LIKE ?\n    AND\n      avsnitt = ?\n   ";
              console.log("Running set grade in backend");
              values = [req.body.grade, req.user.username, req.body.episode_id];
              console.log("VAlues för grade, username och episode_id", values);
              _context8.prev = 5;
              _context8.next = 8;
              return _db["default"].query(createQuery, values);

            case 8:
              console.log("Betygsatt");
              return _context8.abrupt("return", res.status(200).end());

            case 12:
              _context8.prev = 12;
              _context8.t0 = _context8["catch"](5);
              return _context8.abrupt("return", res.status(400).send(_context8.t0));

            case 15:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[5, 12]]);
    }))();
  },
  addTip: function addTip(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
      var createQuery, values, createQuery2, createQuery3, values2, _yield$db$query, tipTime, baseUrl, mailOptions;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              console.log("req.body.username", req.body.username);
              console.log("req.body.episode_id", req.body.episode_id);
              createQuery = "\n      INSERT INTO sparade_avsnitt (anvandare, avsnitt, titel, program_namn, program_id, beskrivning, url, lyssningslank, pub_datum_utc, tipsare, nytt_tips)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ";
              values = [req.body.username, req.body.episode_id, req.body.title, req.body.show_name, req.body.show_id, req.body.description, req.body.url, req.body.listen_link, req.body.pub_date, req.user.username, true];
              createQuery2 = "select \n      EXTRACT(EPOCH FROM (current_timestamp - tipsad)) \n    AS difference, email, tips_mail \n      from anvandare\n    WHERE\n      anvandarnamn = ?\n    ";
              createQuery3 = "update anvandare\n      set tipsad = current_timestamp\n      where anvandarnamn = ?\n    ";
              values2 = [req.body.username];
              _context11.prev = 7;
              _context11.next = 10;
              return _db["default"].query(createQuery, values);

            case 10:
              _context11.next = 12;
              return _db["default"].query(createQuery2, values2);

            case 12:
              _yield$db$query = _context11.sent;
              tipTime = _yield$db$query.rows;

              if (!(tipTime[0].tips_mail && tipTime[0].email && (!tipTime[0].difference || tipTime[0].difference > 60 * 60 * 6))) {
                _context11.next = 25;
                break;
              }

              console.log("SENDING EMAIL TIP");
              console.log("tiptime", tipTime);
              baseUrl = req.protocol + "://" + req.get("host");
              mailOptions = {
                from: 'administrator@radioskugga.org',
                to: tipTime[0].email,
                subject: 'Nya tips på Radioskugga',
                text: "Du har f\xE5tt nya lyssningstips!",
                html: "<h3>Du har f\xE5tt nya lyssningstips! &nbsp;<strong><a href=\"www.radioskugga.org\">Radioskugga</a></strong></h3>"
              };
              _context11.next = 21;
              return _db["default"].query(createQuery3, values2);

            case 21:
              _context11.next = 23;
              return new Promise(function (resolve) {
                return setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                  return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          _helper["default"].transporter.sendMail(mailOptions, /*#__PURE__*/function () {
                            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(error, info) {
                              return regeneratorRuntime.wrap(function _callee9$(_context9) {
                                while (1) {
                                  switch (_context9.prev = _context9.next) {
                                    case 0:
                                      if (!error) {
                                        _context9.next = 4;
                                        break;
                                      }

                                      console.log("Error sending mail", error);
                                      _context9.next = 7;
                                      break;

                                    case 4:
                                      console.log('Email sent: ' + info.response);
                                      console.log("Running query to set timestamp");
                                      return _context9.abrupt("return", res.status(200));

                                    case 7:
                                    case "end":
                                      return _context9.stop();
                                  }
                                }
                              }, _callee9);
                            }));

                            return function (_x, _x2) {
                              return _ref2.apply(this, arguments);
                            };
                          }());

                          resolve();

                        case 2:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                })), 15 * 60 * 1000);
              });

            case 23:
              _context11.next = 26;
              break;

            case 25:
              console.log("Tip time difference not big enough", tipTime[0].difference);

            case 26:
              return _context11.abrupt("return", res.status(201).end());

            case 29:
              _context11.prev = 29;
              _context11.t0 = _context11["catch"](7);
              console.log("Error in addTip", _context11.t0);
              return _context11.abrupt("return", res.status(400).send(_context11.t0));

            case 33:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, null, [[7, 29]]);
    }))();
  },
  getTips: function getTips(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
      var createQuery1, createQuery2, values, tipsReceived, tipsSent;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              createQuery1 = "\n    SELECT * FROM sparade_avsnitt\n    WHERE\n      anvandare LIKE ?\n    AND \n      tipsare IS NOT null\n   ";
              createQuery2 = "\n   SELECT * FROM sparade_avsnitt\n   WHERE\n     tipsare LIKE ?\n  ";
              console.log("USER data:", req.user);
              console.log("RUnning get tips in backend");
              values = [req.user.username];
              _context12.prev = 5;
              _context12.next = 8;
              return _db["default"].query(createQuery1, values);

            case 8:
              tipsReceived = _context12.sent;
              _context12.next = 11;
              return _db["default"].query(createQuery2, values);

            case 11:
              tipsSent = _context12.sent;
              console.log("tipsSent inside getTips", tipsSent);
              console.log("tipsReceived inside getTips", tipsReceived);
              return _context12.abrupt("return", res.status(200).send([tipsSent, tipsReceived]));

            case 17:
              _context12.prev = 17;
              _context12.t0 = _context12["catch"](5);
              console.log("Fel i getTips", _context12.t0);
              return _context12.abrupt("return", res.status(400).send(_context12.t0));

            case 21:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, null, [[5, 17]]);
    }))();
  },
  setOldTips: function setOldTips(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
      var createQuery;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              createQuery = "\n      UPDATE sparade_avsnitt\n      SET\n        nytt_tips = FALSE\n      WHERE\n        anvandare = ?\n    ";
              _context13.next = 3;
              return _db["default"].query(createQuery, [req.user.username]);

            case 3:
              _context13.prev = 3;
              return _context13.abrupt("return", res.status(204).end());

            case 7:
              _context13.prev = 7;
              _context13.t0 = _context13["catch"](3);
              return _context13.abrupt("return", res.status(400).send(_context13.t0));

            case 10:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, null, [[3, 7]]);
    }))();
  },
  removeAllTips: function removeAllTips(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
      var createQuery;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              createQuery = "\n      DELETE FROM sparade_avsnitt\n      WHERE\n        anvandare LIKE ?\n      AND\n        tipsare IS NOT null\n    ";
              _context14.prev = 1;
              _context14.next = 4;
              return _db["default"].query(createQuery, [req.user.username]);

            case 4:
              return _context14.abrupt("return", res.status(204).send());

            case 7:
              _context14.prev = 7;
              _context14.t0 = _context14["catch"](1);
              return _context14.abrupt("return", res.status(400).send(_context14.t0));

            case 10:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, null, [[1, 7]]);
    }))();
  },
  removeOneTip: function removeOneTip(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
      var createQuery, createQuery2, rows;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              console.log("Running removeOneTip");
              console.log("In backend:", req.body.user, req.body.episodeId);
              createQuery = "\n      DELETE FROM sparade_avsnitt\n      WHERE\n        anvandare = ?\n      AND\n        tipsare = ?\n      AND\n        avsnitt = ?\n    ";
              createQuery2 = "\n    SELECT * FROM sparade_avsnitt\n    WHERE\n      anvandare = ?\n    AND\n      tipsare = ?\n    AND\n      avsnitt = ?\n  ";
              _context15.prev = 4;
              _context15.next = 7;
              return _db["default"].query(createQuery, [req.user.username, req.body.user, req.body.episodeId]);

            case 7:
              _context15.next = 9;
              return _db["default"].query(createQuery2, [req.user.username, req.body.user, req.body.episodeId]);

            case 9:
              rows = _context15.sent;
              console.log("Remove one tip done", rows);
              return _context15.abrupt("return", res.status(204).send());

            case 14:
              _context15.prev = 14;
              _context15.t0 = _context15["catch"](4);
              return _context15.abrupt("return", res.status(400).send(_context15.t0));

            case 17:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, null, [[4, 14]]);
    }))();
  }
};
var _default = Episode;
exports["default"] = _default;