require("dotenv").config();
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const dbPath =
  process.env.APP_ENV === "local"
    ? process.env.LOCAL_DB_PATH
    : process.env.DEV_DB_PATH;

const db = new sqlite3.Database(dbPath);

let baseQuery = "SELECT * FROM data WHERE ";

/* GET users listing. */
router.get("/", function(req, res, next) {
  const sortBy = req.query.sortBy.split(",");
  const sortDir = req.query.sortDir.split(",");
  const selectedPositions = req.query.positions.split(",").map(p => `'${p}'`);

  const orderByQuery = sortBy.map((cur, i) => `${cur} ${sortDir[i]}`).join(",");

  let query = baseQuery + "0 != 1 ";

  query += `AND position IN (${selectedPositions.join(",")}) `;

  query += "ORDER BY " + orderByQuery;

  query += " LIMIT 75";

  console.log(query);
  let results = [];
  db.serialize(() => {
    results = db.all(query, (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  });
});

module.exports = router;
