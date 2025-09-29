const express = require("express");
const app = express();
const db = require("./config/db");
const User = require("./models/user");

app.post("/signup", (req, res) => {
  const user = new User({
    firstName: "fasal",
    lastName: "kp",
    password: "fasal@123",
    gender: "male",
  });
  try {
    user.save();
    res.send("user  created successfully");
  } catch (err) {
    res.status(400).send("Unable to process your request: " + err.message);
  }
});

db()
  .then(() => {
    console.log("connected with database");
    app.listen(3000, () => {
      console.log("Server is running succesfully on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
