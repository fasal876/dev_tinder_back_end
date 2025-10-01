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
    res.status(400).send("Something went wrong: " + err.message);
  }
});
app.get("/users", async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await User.findById(userId);
    res.send(result);
  } catch (err) {
    res.status(401).send("Bad request");
  }
});
app.delete("/users", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("user has deleted");
  } catch (err) {
    res.status(401).send("Bad request");
  }
});
app.patch("/users/:userID", async (req, res) => {
  const userId = req.params;
  const data = req.body;
  const keys = Object.keys(req.body);
  const ALLOWED_UPDATES = new Set(["password", "photoURL", "about", "skills"]);

  try {
    if (keys.length > 4) {
      console.log("too many keys");
      throw new Error("So many fields , try again");
    }
    const isAllowed = keys.every((item) => ALLOWED_UPDATES.has(item));
    if (!isAllowed) {
      throw new Error("The fieds are not allowed for update, try again");
    }
    const prev = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(prev);
  } catch (err) {
    res.status(401).send("Bad request" + err.message);
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
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
