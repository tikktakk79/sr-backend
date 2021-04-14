import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import db from "../db"
import Helper from "./Helper"
const dotenv = require("dotenv")

dotenv.config("../../../.env")

const User = {
  /**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async createUser(req, res) {
    console.log("Entering create function")
    if (!req.body.password || !req.body.username) {
      return res.status(400).send({ message: "Alla fält är inte ifyllda" })
    }

    const hashPassword = Helper.hashPassword(req.body.password)

    const createQuery = `INSERT INTO
      anvandare (anvandarnamn, fornamn, efternamn, email, losenord)
      VALUES ($1, $2, $3, $4, $5)
      returning *`
    const values = [
      req.body.username,
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      hashPassword //hashPassword
    ]

    try {
      const { rows } = await db.query(createQuery, values)
      const token = Helper.generateToken(rows[0].anvandarnamn)
      return res.status(201).send({ token })
    } catch (error) {
      if (error.routine === "_bt_check_unique") {
        return res.status(400).send({ message: "Användarnamnet är upptaget" })
      }
      console.log("Something failed and I don't know what!")
      return res.status(400).send(error)
    }
  },
  /**
   * Login
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  async loginUser(req, res) {
    console.log("HEj fron loginUser")
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: "Alla fält är inte ifyllda" })
    }
    console.log("111We got to here!")
    const text = "SELECT * FROM anvandare WHERE anvandarnamn = $1"
    try {
      console.log("222We got to here!")
      const { rows } = await db.query(text, [req.body.username])
      console.log("Queryn funkade här kommer rows", rows)
      if (!rows[0]) {
        return res
          .status(400)
          .send({ message: "Inloggningsuppgifterna du angav är felaktiga" })
      }
      console.log("333We got to here!")
      console.log("Användarnamn stämmer")
      if (!Helper.comparePassword(rows[0].losenord, req.body.password)) {
        console.log("Compare pasword sket sig..")
        return res
          .status(400)
          .send({ message: "Inloggningsuppgifterna du angav är felaktiga" })
      }

      console.log("KOM enda hit")
      const token = Helper.generateToken(rows[0].anvandarnamn)
      return res.status(200).send({ token })
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  /**
   * Delete A User
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  async deleteUser(req, res) {
    const deleteQuery =
      "DELETE FROM anvandare WHERE anvandarnamn=$1 returning *"
    try {
      const { rows } = await db.query(deleteQuery, [
        req.body.username /* req.user.username */
      ])
      if (!rows[0]) {
        return res.status(404).send({ message: "Användare hittades ej" })
      }
      return res.status(204).send()
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async updateUser(req, res) {
    console.log("Running user update on backend")

    const updateQuery =
      `UPDATE anvandare
        SET (fornamn, efternamn, email) =
        ($1, $2, $3)
        WHERE anvandarnamn=$4 returning *`

      try {
        await db.query(updateQuery, [
          req.body.firstname, req.body.lastname, req.body.email,
          req.user.username
        ])
        return res.status(204).send()
      } catch (error) {
        return res.status(400).send(error)
      }
  },

  async changePassword(req, res) {
    console.log("Username from changePassword:", req.user.username),
    console.log("New password:", req.body.newPassword)

    if (!req.body.password || !req.body.newPassword) {
      return res.status(400).send({ message: "Alla fält är inte ifyllda" })
    }
    console.log("222We got to here!")
    const text = "SELECT * FROM anvandare WHERE anvandarnamn = $1"

    try {
      const { rows } = await db.query(text, [req.user.username])
      console.log("Queryn funkade")
      if (!rows[0]) {
        return res
          .status(400)
          .send({ message: "Inloggningsuppgifterna du angav är felaktiga" })
      }
      console.log("333We got to here!")

      if (!Helper.comparePassword(rows[0].losenord, req.body.password)) {
        console.log("Compare pasword sket sig..")
        return res
          .status(400)
          .send({ message: "badPassword" })
      }

      console.log("KOM enda hit, lösenordet stämmer")
      const passwordQuery =
        `UPDATE anvandare
          SET losenord = $1
          WHERE anvandarnamn=$2`

      const hashPassword = Helper.hashPassword(req.body.newPassword)
      try {
        await db.query(passwordQuery, [
          hashPassword, req.user.username
        ])
        console.log("Lösenord bytt")
        return res.status(204).send()
      } catch (error) {
        return res.status(400).send(error)
      }
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async getUserData(req, res) {
    const createQuery =
    `SELECT anvandarnamn, fornamn, efternamn, email
    FROM anvandare
    WHERE anvandarnamn LIKE $1`

    try {
      const { rows } = await db.query(createQuery, [req.user.username])
      console.log("Username to use", req.user.username)
      console.log("USER data to send: ", rows)
      return res.status(201).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async searchUsers(req, res) {
    console.log("Searching for users")
    const createQuery = `SELECT anvandarnamn, fornamn, efternamn, hemligt FROM anvandare
    WHERE
      anvandarnamn ILIKE
        $1
    OR
      fornamn ILIKE
        $2
    OR
      efternamn ILIKE
        $3
    OR
      email ILIKE
        $4
   `

    console.log("QUERY", req.query)
    console.log("QUERY FIRSTNAME", req.query.firstname)

    let username = req.query.username || ""
    let firstname = req.query.firstname || ""
    let lastname = req.query.lastname || ""
    let email = req.query.email || ""

    const values = [username, firstname, lastname, email]

    console.log("VALUES", values)

    try {
      const { rows } = await db.query(createQuery, values)
      let rowsMod = rows.filter((row) => row.anvandarnamn !== req.user.username)
      return res.status(201).send(rowsMod)
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}

export default User
