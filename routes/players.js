require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const dbPath =
  process.env.app_env === "local"
    ? process.env.local_db_path
    : process.env.dev_db_path;

const db = new sqlite3.Database(dbPath);

/* GET users listing. */
router.get("/", function(req, res, next) {
  let results = [];
  db.serialize(() => {
    results = db.all("SELECT * FROM data WHERE speed > 90", (err, rows) => {
      res.json(rows);
    });
  });
});

module.exports = router;
