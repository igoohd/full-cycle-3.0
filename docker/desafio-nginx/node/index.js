const express = require("express");
const app = express();
const port = 8080;

const mysql = require("mysql");
const pool = mysql.createPool({
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
});

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      res.status(500).send("Error connecting to database");
      return;
    }

    const insertNameQuery = `INSERT INTO people(name) values('Nome novo')`;
    connection.query(insertNameQuery, (insertErr) => {
      if (insertErr) {
        console.error("Error inserting data:", insertErr);
        res.status(500).send("Error inserting data");
        connection.release();
        return;
      }

      const getNamesQuery = `SELECT name FROM people`;
      connection.query(getNamesQuery, (selectErr, result) => {
        connection.release(); // Release the connection back to the pool

        if (selectErr) {
          console.error("Error fetching data:", selectErr);
          res.status(500).send("Error fetching data");
          return;
        }

        const names = result.map((row) => row.name);
        console.log("NAMES", names);

        let response = "<h1>Full Cycle Rocks!!</h1>";
        response += "<ul>";
        names.forEach((name) => {
          console.log("name:", name);
          response += `<li>${name}</li>`;
        });
        response += "</ul>";

        res.send(response);
      });
    });
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
