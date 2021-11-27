// src/usingDB/models/index.js
import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

let poolObject = {
  connectionString: process.env.DATABASE_URL
}

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
  poolObject.ssl = {
    rejectUnauthorized: false
  }
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
})

pool.on("connection", () => {
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
      pool.getConnection((err, conn) => {
        if (err) {
          console.log('query connec error!', err);
          // resolve(err);
        } else {
          conn.query(text, params, (err, rows) => {
            if (err) {
              console.log("Query failed", err)
              reject (err)
            } else {
              console.log("Query resolved", rows)
              resolve(rows)
              console.log("Code after resolve")
            }
            conn.release()
          })
        }
      })
    })
  }
}
