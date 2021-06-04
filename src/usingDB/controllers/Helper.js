// src/usingDB/controllers/Helper.js
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword)
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(username) {
    console.log("Hello from generatToken! username is, ", username)
    const token = jwt.sign(
      {
        username: username
      },
      process.env.SECRET,
      { expiresIn: "7d" }
    )
    console.log("Hello AGAIN from generatToken!")
    return token
  },
  createVerificationToken(email) {
    const token = jwt.sign(
      {
        email: email
      },
      process.env.SECRET,
      { expiresIn: 60 * 60 }
    )
    console.log("Hello AGAIN from generatToken!")
    return token
  },

  userRelations(myUser, relations) {
    let friendsMod = []

    relations.map((raw) => {
      let friend = {}


      friend.id = raw.id
      friend.ny_fraga = raw.ny_fraga

      console.log("RAW", raw)

      if (raw.anvandare1 === myUser) {
        friend.username = raw.anvandare2
        friend.fornamn = raw.fnamn2
        friend.efternamn = raw.enamn2
        friend.email = raw.email2
        friend.hemligt = raw.hemligt2
      } else {
        friend.username = raw.anvandare1
        friend.fornamn = raw.fnamn1
        friend.efternamn = raw.enamn1
        friend.email = raw.email1
        friend.hemligt = raw.hemligt1
      }
      if (raw.godkann === myUser) {
        friend.godkann = "you"
      } else if (raw.godkann === friend.username) {
        friend.godkann = "waiting"
      } else {
        friend.godkann = null
      }
      console.log("One iteration..")
      friendsMod.push(friend)
    })
    console.log("All iterations done")
    console.log("friensMod from helper method", friendsMod)

    return friendsMod
  },
  async permissionFriend(db, req) {

    let createQuery1 = `
      SELECT hemligt from anvandare 
      WHERE
        anvandarnamn LIKE $1
    `

    let { rows } = await db.query(createQuery1, [req.body.username])

    if (!rows[0].hemligt) {
      console.log("TRUE DAT");
      return true
    }

    let createQuery2 = `
    select * from vanner
    where 
      (anvandare1 LIKE $1 AND anvandare2 LIKE $2)
    OR 
      (anvandare2 LIKE $1 AND anvandare1 LIKE $2)
    AND  
      (godkann IS NULL OR godkann LIKE $1)
    `

    let rows2 = await db.query(createQuery2, [req.user.username, req.body.username])
    
    if(rows2.rows.length) {
      console.log("TRUE DAT");
      return true
    }
    console.log("FALSE DAT");
    return false
  },
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stellanurbansson@gmail.com',
      pass: process.env.EMAIL_PASSWORD 
    }
  }),
  
}


export default Helper
