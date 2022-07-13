const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const ccc = require("md5");

const db = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "iconvacancy",
});

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/***************** User *****************/

app.listen(3001, () => {
  console.log("running on 3001 port");
});

app.post("/u/login", (req, res) => {
  const email = req.body.email;
  const password = ccc(req.body.password);

  const sqlSelect = "SELECT * FROM user WHERE email=? AND password=?;";
  db.query(sqlSelect, [email, password], (err, result) => {
    if (!result.length) {
      res.send("Invalid Email or Password");
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

app.post("/u/registrations", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = ccc(req.body.password);
  const password_confirmation = ccc(req.body.password_confirmation);
  const error = "Wrong Password Confirmation";
  const success = "Registration Successful";

  if (password !== password_confirmation) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(error));
  } else {
    const Select = "SELECT * FROM user WHERE email=?";
    db.query(Select, [email], (err, result) => {
      if (err) {
      } else {
        if (result.length > 0) {
          res.send("Email is Already Registered");
        } else {
          const Insert =
            "INSERT INTO user (fname,lname,email,password) VALUES(?,?,?,?)";
          db.query(Insert, [fname, lname, email, password], (err, result) => {
            if (err) {
            } else {
              res.send(success);
              console.log("Register Success " + email);
            }
          });
        }
      }
    });
  }
});

/***************** User *****************/
