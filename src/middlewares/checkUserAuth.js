const jwt = require("jsonwebtoken");
const User = require("../models/user");
const checkUserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decoded = await jwt.verify(token, "Dev@Tinder*123");
    if (!decoded) {
      throw new Error("Invaid token");
    }
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
