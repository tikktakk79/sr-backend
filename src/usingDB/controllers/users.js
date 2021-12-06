import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import db from "../db"
import helper from "./helper.js"
import jwt from "jsonwebtoken"
import winston from "winston"
// const cryptoRandomString =  require("crypto-random-string")
const Str = require('@supercharge/strings')
const dotenv = require("dotenv")
const express = require('express');
var path = require('path');

dotenv.config("../../../.env")

var rand,mailOptions,host,link

const User = {
  /**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async createUser(req, res) {
    console.log("Entering create function")
    if (!req.body.password || !req.body.username || !req.body.email) {
      return res.status(400).send({ message: "Alla fält är inte ifyllda" })
    }

    const hashPassword = helper.hashPassword(req.body.password)

    const removeDuplicate = 
    `DELETE FROM anvandare
      WHERE
        status = 'pending'
      AND
        email = ?
    `

    const createQuery = `INSERT INTO
      anvandare (anvandarnamn, fornamn, efternamn, email, losenord, aktiveringskod)
      VALUES (?, ?, ?, ?, ?, ?)
      `


    
      
    // const token = helper.generateToken(rows[0].anvandarnamn)
    // req.session.token = token
    // return res.status(201).send({ token })
  
    let baseUrl = req.protocol + "://" + req.get("host")

    const secretCode = helper.createVerificationToken(req.body.email);

    console.log("secret Code", secretCode);

    const values = [
      req.body.username,
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      hashPassword, //hashPassword
      secretCode
    ]


    try {
      await db.query(removeDuplicate, [values[3]])
      } catch (error){
        console.log("Error in register db query", error);
      }

    try {
      console.log("Before create query in db")
      await db.query(createQuery, values)
      console.log("After create query")

      try {
        
        const mailOptions = {
          from: process.env.EMAIL_ADDRESS,
          to: req.body.email,
          subject: 'Confirm registration',
          text: `Använd följande länk för att aktivera ditt konto på Radioskugga: ${baseUrl}/api/user/verification/verify-account/${secretCode}`,
          html: `<p>Använd följande länk för att aktivera ditt konto på Radioskugga: &nbsp;<strong></p><h3><a href="${baseUrl}/api/user/verification/verify-account/${secretCode}" target="_blank">Aktivera konto</a></strong></h3>`,
        }
        console.log("Trying to send email")
        await helper.transporter.sendMail(mailOptions, function(error, info){
          if (error) {
          console.log("Error sending mail", error);
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send()
          }
        });
          console.log("Mail sent");
        } catch (error){
  
        console.log("Error in register db query", error);
        }
      } catch (error) {
        console.log("ERROR in register", error)
        console.log("error routine", error.code);
        console.log("Användarnamnet är upptaget");
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).send({message: "Username taken"})
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
    console.log("HEj fron loginUser, proc env", process.env.NODE_ENV, )
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: "Alla fält är inte ifyllda" })
    }
    console.log("1We got to here!")
    const text = "SELECT * FROM anvandare WHERE anvandarnamn = ?"
  
    try {
      console.log("2We got to here!")
      console.log("AND HERE")
      console.log("UNAME", req.body.username)
      
      let rows 

      let errObj = {}

      try {
        // rows = await db.query(text, [req.body.username])
        console.log("Query text", text)
        rows = await db.query(text, [req.body.username])
      }
        catch (error) {
        console.log("Error i login query", error)
      }
      console.log("Queryn funkade här kommer rows", rows)
      if (!rows[0]) {
        console.log("No match for user in database")
        errObj = {statusText: "No match for user in database"}
        res.status(400)
        res.send(errObj)
        return
      } else if (rows[0].status !== "member"){
        errObj = {statusText: "User not verified"}
        res.status(400).send(errObj)
        return
      }
      console.log("333We got to here!")
      console.log("Användarnamn stämmer")
      if (!helper.comparePassword(rows[0].losenord, req.body.password)) {
        console.log("Compare pasword sket sig..")
        let errObj = {statusText: "Current password does not match"}
        res.status(400).send(errObj)
        return
      }

      console.log("KOM enda hit")
      const token = helper.generateToken(rows[0].anvandarnamn)
      return res.status(200).send({ token })
    } catch (error) {
      console.log("ERROR", error)
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
    const selectQuery =
      "SELECT * FROM anvandare WHERE anvandarnamn=?"
    const deleteQuery =
      "DELETE FROM anvandare WHERE anvandarnamn=?"
    try {
      let {rows} = await db.query(deleteQuery, [
        req.body.username /* req.user.username */
      ])

      if (!rows[0]) {
        return res.status(404).send({ message: "Användare hittades ej" })
      }
      await db.query(deleteQuery, [
        req.body.username /* req.user.username */
      ])

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
        (?, ?, ?)
        WHERE anvandarnamn=?`

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
    const text = "SELECT * FROM anvandare WHERE anvandarnamn = ?"

    try {
      const rows = await db.query(text, [req.user.username])
      console.log("Queryn funkade")
      if (!rows[0]) {
        return res
          .status(400)
          .send({ message: "Inloggningsuppgifterna du angav är felaktiga" })
      }
      console.log("333We got to here!")

      if (!helper.comparePassword(rows[0].losenord, req.body.password)) {
        console.log("Compare pasword sket sig..")
        return res
          .status(400)
          .send({ message: "badPassword" })
      }

      console.log("KOM enda hit, lösenordet stämmer")
      const passwordQuery =
        `UPDATE anvandare
          SET losenord = ?
          WHERE anvandarnamn=?`

      const hashPassword = helper.hashPassword(req.body.newPassword)
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
    WHERE anvandarnamn LIKE ?`

    try {
      const rows = await db.query(createQuery, [req.user.username])
      console.log("Username to use", req.user.username)
      console.log("USER data to send: ", rows)
      return res.status(201).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async searchUsers(req, res) {
    console.log("Searching for users")
    const createQuery = `SELECT anvandarnamn, hemligt FROM anvandare
    WHERE
      anvandarnamn LIKE
        LOWER(?)
   `

    console.log("QUERY", req.query)
    console.log("QUERY FIRSTNAME", req.query.firstname)

    let username = req.query.username || ""
    let firstname = req.query.firstname || ""
    let lastname = req.query.lastname || ""
    let email = req.query.email || ""

    const values = [username]

    console.log("VALUES", values)

    try {
      const rows = await db.query(createQuery, values)
      console.log("Rows from searchUsers", rows);
      let rowsMod = rows.filter((row) => row.anvandarnamn !== req.user.username)
      return res.status(201).send(rowsMod)
    } catch (error) {
      return res.status(400).send(error)
    }
  },



// #route:  GET /verification/verify-account
// #desc:   Verify user's email address
// #access: Public

  async verifyAccount(req, res) {

    let decoded
    console.log("Verifying account")

    try {
      decoded = await jwt.verify(req.params.secretCode, process.env. SECRET)
    } catch (err) {
      console.log(
        "Error on /api/user/verification/verify-account: jwt verification ",
        err
    )

      return res.sendFile("verification-jwt-fail.html", { root: path.join(__dirname, '../../../public') })  

    }
    const updateUser = `
      UPDATE anvandare
      SET 
        aktiveringskod = null,
        status = 'member'
      WHERE
        aktiveringskod = ?
      AND
        email = ?
    `
    const values = [req.params.secretCode, decoded.email]

    try {          
      const rows = await db.query(updateUser, values)
      console.log("Rows from updateUser", rows);
        
    } catch (err) {
        console.log(
            "Error on /api/auth/verification/verify-account: ",
            err
        );
        
        
        return res.sendFile("verification-db-fail.html", { root: path.join(__dirname, '../../../public') }) 
    } 
    console.log("Verification success")
    res.sendFile("verification-success.html", { root: path.join(__dirname, '../../../public') }) 
 
  }

}

export default User
