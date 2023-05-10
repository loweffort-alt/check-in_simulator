require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "password",
  database: process.env.DB_NAME || "airline",
});

module.exports = pool.promise();
