const express = require("express");
const app = express();
const db = require("./config/db");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { signupValidation, validateLogin } = require("../utility/validation");
const jwt = require("jsonwebtoken");
const { checkUserAuth } = require("./middlewares/checkUserAuth");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //check vaidation for fields
    signupValidation(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("user created successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const validCredentials = bcrypt.compare(password, user.password);
    if (!validCredentials) {
      throw new Error("Invalid credentials");
    }
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder*123", {
      expiresIn: "10000",
    });
    res.cookie("token", token);
    res.send("user login succesful");
  } catch (err) {
    res.status(400).send("Bad request " + err.message);
  }
});
app.get("/profile", checkUserAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("bad request " + err.message);
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
