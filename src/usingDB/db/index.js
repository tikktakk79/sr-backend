// src/usingDB/models/index.js
import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  ssl: {
    rejectUnauthorized: false
  }
})

pool.on("connect", () => {
  console.log("connected to the db")
})

export default {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(text, params)
        .then((res) => {
          console.log("Tror det gick vägen")
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
