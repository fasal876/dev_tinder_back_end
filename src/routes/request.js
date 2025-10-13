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
    if (connectionExist) {
      throw new Error(" cannot make the connection");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    res.json({ message: "succes" });
  } catch (err) {
    res.status(400).json({ message: "success" });
  }
});
requestRouter.post(
  "/review/:status/:requestId",
  checkUserAuth,
  async (req, res) => {
    try {
      const loggedUserId = req.user._id;
      const status = req.params.status;
      const requestId = req.params.requestId;
      //check if status accepted, reject
      if (status !== "accepted" && status !== "rejected") {
        throw new Error("Invalid status");
      }
      //only allow if request is id present,toUserId is loggeduser and status is pending
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Invalid request");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: status + " request succesfully updated", data });
    } catch (err) {
      res.status(400).send("Bad request : " + err.message);
    }
  }
);
module.exports = requestRouter;
