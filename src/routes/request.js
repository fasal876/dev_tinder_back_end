const express = require("express");
const { checkUserAuth } = require("../middlewares/checkUserAuth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post("/send/:status/:userID", checkUserAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userID;
    const status = req.params.status;

    //faults
    //1.status may be accepted or reject
    if (status !== "interested" && status !== "ignored") {
      throw new Error("Not a valid status");
    }
    //2.check if user id is valid
    const isUserPresent = await User.findById(toUserId);
    if (!isUserPresent) {
      throw new Error("invalid user");
    }
    //check if either user already made request to themselves
    const connectionExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    console.log(connectionExist);
    if (connectionExist) {
      throw new Error(" cannot make the connection");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    await connectionRequest.save();
    res.send("valid");
  } catch (err) {
    res.status(400).send("Bad request " + err.message);
  }
});
module.exports = requestRouter;
