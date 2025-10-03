const express = require("express");
const { checkUserAuth } = require("../middlewares/checkUserAuth");
const requestRouter = express.Router();

requestRouter.get("/", checkUserAuth, (req, res) => {
  res.send("bla blas");
});
module.exports = requestRouter;
