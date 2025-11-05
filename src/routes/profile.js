const express = require("express");
const { checkUserAuth } = require("../middlewares/checkUserAuth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  validateUpdateRequest,
  validateUpdatePassword,
} = require("../utility/validation");
const profileRouter = express.Router();

profileRouter.get("/view", checkUserAuth, (req, res) => {
  try {
    const user = req.user;
    res.json({ data: user });
  } catch (err) {
    res.status(400).send("Bad request : " + err.message);
  }
});
profileRouter.patch("/edit", checkUserAuth, async (req, res) => {
  try {
    const isValidFields = validateUpdateRequest(req);

    if (!isValidFields) {
      throw new Error("Invalid fields");
    }
    const user = req.user;
    const updatedUser = req.body;

    Object.keys(updatedUser).forEach((field) => {
      user[field] = updatedUser[field];
    });
    await user.save();
    res.json({ message: "update successfuly", data: req.user });
  } catch (err) {
    res.status(400).send("Bad request " + err.message);
  }
});
profileRouter.patch("/password", checkUserAuth, async (req, res) => {
  try {
    validateUpdatePassword(req);
    const user = req.user;
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    res.json({ message: "password changed succesfully", data: req.user });
  } catch (err) {
    res.status(400).send("Bad request : " + err.message);
  }
});
module.exports = profileRouter;
