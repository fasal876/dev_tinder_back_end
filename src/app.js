const express = require("express");
const app = express();
const db = require("./config/db");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userData = req.body;
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user created successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
app.get("/users", async (req, res) => {
  try {
    const result = await User.findOne();
    res.send(result);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
  } catch (err) {}
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
