// src/usingDB/models/index.js
import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

let poolObject = {
  connectionString: process.env.DATABASE_URL
}

if (process.env.DATABASE_URL.slice(0,4) === "post") {
  poolObject.ssl = {
    rejectUnauthorized: false
  }
}

const pool = new Pool(poolObject)

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
