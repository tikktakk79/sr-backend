"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var jwt = require("jsonwebtoken");

var authenticateTokenWhilePending = function authenticateTokenWhilePending(req, res, next) {
  var token = req.session.token;
  jwt.verify(token, process.env.SECRET, function (err, user) {
    if (err) {
      res.sendStatus(401);
    } else {
      req.userId = user.userId;
      req.userRole = user.userRole;
      req.userStatus = user.userStatus;
      next();
    }
  });
};

var _default = authenticateTokenWhilePending;
exports["default"] = _default;