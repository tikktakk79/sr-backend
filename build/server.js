#!/usr/bin/env node
// server.js
"use strict";

var _express = _interopRequireDefault(require("express"));

require("core-js/stable");

require("regenerator-runtime/runtime");

var _users = _interopRequireDefault(require("./usingDB/controllers/users"));

var _episode_list = _interopRequireDefault(require("./usingDB/controllers/episode_list"));

var _recommendations = _interopRequireDefault(require("./usingDB/controllers/recommendations"));

var _friends = _interopRequireDefault(require("./usingDB/controllers/friends"));

var _Auth = _interopRequireDefault(require("./usingDB/middleware/Auth"));

var _checkAuthWhilePending = _interopRequireDefault(require("./usingDB/middleware/checkAuthWhilePending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}


//import "babel-polyfill"
var cors = require("cors");

var User = _users["default"];
var Episode = _episode_list["default"];
var Rec = _recommendations["default"];
var Friend = _friends["default"];
var app = (0, _express["default"])();
var allowed;

if (process.env.DATABASE_URL.includes("localhost")) {
  allowed = ["http://localhost:8080", "http://localhost:5000"];
} else {
  allowed = ["https://sr-finder-frontend.herokuapp.com", "https://radioskugga.herokuapp.com", "https://sr-frontend-vue.herokuapp.com", "https://www.sjoburger.com"];
}

var corsOptions = {
  origin: allowed
};
app.use(_express["default"].json());
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.use(_express["default"]["static"]("client/build"));
}

app.get("/", function (req, res) {
  return res.status(200).send({
    message: "YAY! Congratulations! Your first endpoint is working"
  });
});
app.post("/api/user", User.createUser);
app.get("/api/user/verification/verify-account/:secretCode", User.verifyAccount);
app.post("/api/user/login", User.loginUser);
app.post("/api/user/delete", _Auth["default"].verifyToken, User.deleteUser);
app.get("/api/user/search", _Auth["default"].verifyToken, User.searchUsers);
app.get("/api/user/data", _Auth["default"].verifyToken, User.getUserData);
app.post("/api/user/update", _Auth["default"].verifyToken, User.updateUser);
app.post("/api/user/password", _Auth["default"].verifyToken, User.changePassword);
app.post("/api/grade", _Auth["default"].verifyToken, Episode.setGrade);
app.post("/api/episode", _Auth["default"].verifyToken, Episode.saveEpisode);
app.get("/api/episode", _Auth["default"].verifyToken, Episode.listEpisodes);
app.get("/api/program", _Auth["default"].verifyToken, Episode.getPrograms);
app.post("/api/program", _Auth["default"].verifyToken, Episode.gradeProgram);
app.post("/api/program/update", _Auth["default"].verifyToken, Episode.updateProgram);
app.post("/api/program/delete", _Auth["default"].verifyToken, Episode.deleteProgram);
app.post("/api/episode/delete", _Auth["default"].verifyToken, Episode.deleteEpisode);
app.post("/api/tip", _Auth["default"].verifyToken, Episode.addTip);
app.post("/api/tip/remove-all", _Auth["default"].verifyToken, Episode.removeAllTips);
app.post("/api/tip/remove", _Auth["default"].verifyToken, Episode.removeOneTip);
app.get("/api/tip", _Auth["default"].verifyToken, Episode.getTips);
app.post("/api/tip/update", _Auth["default"].verifyToken, Episode.setOldTips);
app.post("/api/rec", _Auth["default"].verifyToken, Rec.saveRec);
app.get("/api/rec", _Auth["default"].verifyToken, Rec.listRecs);
app.post("/api/rec/delete", _Auth["default"].verifyToken, Rec.deleteRec);
app.post("/api/friend", _Auth["default"].verifyToken, Friend.addFriend);
app.post("/api/friend/accept", _Auth["default"].verifyToken, Friend.acceptFriend);
app.post("/api/friend/wait", _Auth["default"].verifyToken, Friend.waitFriend);
app.post("/api/friend/delete", _Auth["default"].verifyToken, Friend.deleteFriend);
app.post("/api/friend/update", _Auth["default"].verifyToken, Friend.setOld);
app.post("/api/friend/episode", _Auth["default"].verifyToken, Friend.episode);
app.post("/api/friend/program", _Auth["default"].verifyToken, Friend.program);
app.get("/api/friend", _Auth["default"].verifyToken, Friend.listFriends);
app.get("/api/secret", _Auth["default"].verifyToken, Friend.getSecret);
app.post("/api/secret", _Auth["default"].verifyToken, Friend.setSecret);
app.get("/api/tips-mail", _Auth["default"].verifyToken, Friend.getTipsMail);
app.post("/api/tips-mail", _Auth["default"].verifyToken, Friend.setTipsMail);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Our app is running on port ".concat(PORT));
});