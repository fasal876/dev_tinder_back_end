const express = require("express");
const { signupValidation, validateLogin } = require("../../utility/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("user login succesful");
  } catch (err) {
    res.status(400).send("Bad request " + err.message);
  }
});
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date() });
  res.send("successfully logout");
});
module.exports = authRouter;
