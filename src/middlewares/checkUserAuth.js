const jwt = require("jsonwebtoken");
const User = require("../models/user");
const checkUserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("unauthorized request");
    }
    const decoded = await jwt.verify(token, "Dev@Tinder*123");
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("Invalid user");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Bad request " + err.message);
  }
};
module.exports = { checkUserAuth };
