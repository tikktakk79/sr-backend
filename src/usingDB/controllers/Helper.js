// src/usingDB/controllers/Helper.js
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
  }
}

export default Helper
