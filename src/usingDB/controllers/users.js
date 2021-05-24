import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import db from "../db"
import Helper from "./Helper"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
// const cryptoRandomString =  require("crypto-random-string")
const Str = require('@supercharge/strings')
const dotenv = require("dotenv")
const express = require('express');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stellanurbansson@gmail.com',
    pass: process.env.EMAIL_PASSWORD // naturally, replace both with your real credentials or an application-specific password
  }
});

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

    const hashPassword = Helper.hashPassword(req.body.password)

    const removeDuplicate = 
    `DELETE FROM anvandare
      WHERE
        status = 'pending'
      AND
        email = $1
    `

    const createQuery = `INSERT INTO
      anvandare (anvandarnamn, fornamn, efternamn, email, losenord, aktiveringskod)
      VALUES ($1, $2, $3, $4, $5, $6)
      returning *`


    
      
      // const token = Helper.generateToken(rows[0].anvandarnamn)
      // req.session.token = token
      // return res.status(201).send({ token })
      const baseUrl = req.protocol + "://" + req.get("host");
      const secretCode = Helper.createVerificationToken(req.body.email);

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
        const rowsDuplicate = await db.query(removeDuplicate, [values[3]])
        console.log("ROWSdupl", rowsDuplicate);
        } catch (error){
  
        console.log("Error in register db query", error);
        }
  
      try {
        const { rows } = await db.query(createQuery, values)

        try {

          const mailOptions = {
            from: 'administrator@radioskugga.org',
            to: req.body.email,
            subject: 'Confirm registration',
            text: `Använd följande länk för att aktivera ditt konto på Radioskugga: ${baseUrl}/api/user/verification/verify-account/${secretCode}`,
            html: `<p>Använd följande länk för att aktivera ditt konto på Radioskugga: &nbsp;<strong></p><h3><a href="${baseUrl}/api/user/verification/verify-account/${secretCode}" target="_blank">Aktivera konto</a></strong></h3>`,
          }
    
          await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log("Error sending mail", error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.status(200).send()
            }
          });
    
    
    
    
        } catch (error) {
          if (error.routine === "_bt_check_unique") {
            return res.status(400).send({ message: "Användarnamnet är upptaget" })
          }
          console.log("Something failed and I don't know what!")
          return res.status(400).send(error)
        }

        console.log("ROWS", rows);
        } catch (error){
  
        console.log("Error in register db query", error);
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
        res.statusMessage = "No match for user in database"
        return res
          .status(400)
          .send()
      } else if (rows[0].status !== "member"){
        res.statusMessage = "User not verified"
        return res
        .status(400)
        .send()
      }
      console.log("333We got to here!")
      console.log("Användarnamn stämmer")
      if (!Helper.comparePassword(rows[0].losenord, req.body.password)) {
        console.log("Compare pasword sket sig..")
        res.statusMessage = "Current password does not match"
        return res
          .status(400)
          .send()
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
    const createQuery = `SELECT anvandarnamn, hemligt FROM anvandare
    WHERE
      anvandarnamn ILIKE
        $1
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
      const { rows } = await db.query(createQuery, values)
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

    try {
      decoded = await jwt.verify(req.params.secretCode, process.env. SECRET)
    } catch (err) {
      return res.sendFile("/Users/msberg/Vue/sr-backend/public/verification-jwt-fail.html")  
        console.log(
            "Error on /api/user/verification/verify-account: jwt verification ",
            err
        );
    }
    const updateUser = `
      UPDATE anvandare
      SET 
        aktiveringskod = null,
        status = 'member'
      WHERE
        aktiveringskod = $1
      AND
        email = $2
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
        return res.sendFile("/Users/msberg/Vue/sr-backend/public/verification-success.html") 
    } 
    return res.sendFile("/Users/msberg/Vue/sr-backend/public/verification-success.html")  
 
  }

}

export default User
