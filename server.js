#!/usr/bin/env node
// server.js
import express from "express"
//import "babel-polyfill"
import "core-js/stable"
import "regenerator-runtime/runtime"
const cors = require("cors")

import UserWithDb from "./usingDB/controllers/users"
import EpisodeWithDb from "./usingDB/controllers/episode_list"
import RecWithDb from "./usingDB/controllers/recommendations"
import FriendWithDb from "./usingDB/controllers/friends"
import Auth from "./usingDB/middleware/Auth"
import authenticateTokenWhilePending from "./usingDB/middleware/checkAuthWhilePending"

const User = UserWithDb
const Episode = EpisodeWithDb
const Rec = RecWithDb
const Friend = FriendWithDb
const app = express()

var corsOptions = {
  origin: "http://localhost:8080"
}

app.use(express.json())
app.use(cors(corsOptions))

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
}

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "YAY! Congratulations! Your first endpoint is working" })
})

app.post("/api/user", User.createUser)
app.get("/api/user/verification/verify-account/:secretCode", User.verifyAccount)
app.post("/api/user/login", User.loginUser)
app.post("/api/user/delete", Auth.verifyToken, User.deleteUser)
app.get("/api/user/search", Auth.verifyToken, User.searchUsers)
app.get("/api/user/data", Auth.verifyToken, User.getUserData)
app.post("/api/user/update", Auth.verifyToken, User.updateUser)
app.post("/api/user/password", Auth.verifyToken, User.changePassword)
app.post("/api/grade", Auth.verifyToken, Episode.setGrade)
app.post("/api/episode", Auth.verifyToken, Episode.saveEpisode)
app.get("/api/episode", Auth.verifyToken, Episode.listEpisodes)
app.get("/api/program", Auth.verifyToken, Episode.getPrograms)
app.post("/api/program", Auth.verifyToken, Episode.gradeProgram)
app.post("/api/program/update", Auth.verifyToken, Episode.updateProgram)
app.post("/api/program/delete", Auth.verifyToken, Episode.deleteProgram)
app.post("/api/episode/delete", Auth.verifyToken, Episode.deleteEpisode)
app.post("/api/tip", Auth.verifyToken, Episode.addTip)
app.post("/api/tip/remove-all", Auth.verifyToken, Episode.removeAllTips)
app.post("/api/tip/remove", Auth.verifyToken, Episode.removeOneTip)
app.get("/api/tip", Auth.verifyToken, Episode.getTips)
app.post("/api/tip/update", Auth.verifyToken, Episode.setOldTips)
app.post("/api/rec", Auth.verifyToken, Rec.saveRec)
app.get("/api/rec", Auth.verifyToken, Rec.listRecs)
app.post("/api/rec/delete", Auth.verifyToken, Rec.deleteRec)
app.post("/api/friend", Auth.verifyToken, Friend.addFriend)
app.post("/api/friend/accept", Auth.verifyToken, Friend.acceptFriend)
app.post("/api/friend/wait", Auth.verifyToken, Friend.waitFriend)
app.post("/api/friend/delete", Auth.verifyToken, Friend.deleteFriend)
app.post("/api/friend/update", Auth.verifyToken, Friend.setOld)
app.post("/api/friend/episode", Auth.verifyToken, Friend.episode)
app.post("/api/friend/program", Auth.verifyToken, Friend.program)
app.get("/api/friend", Auth.verifyToken, Friend.listFriends)
app.get("/api/secret", Auth.verifyToken, Friend.getSecret)
app.post("/api/secret", Auth.verifyToken, Friend.setSecret)
app.get("/api/tips-mail", Auth.verifyToken, Friend.getTipsMail)
app.post("/api/tips-mail", Auth.verifyToken, Friend.setTipsMail)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`)
})
