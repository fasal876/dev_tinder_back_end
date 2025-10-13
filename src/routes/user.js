const express = require("express");
const { checkUserAuth } = require("../middlewares/checkUserAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_FILTER = "firstName lastName skills age about photoURL genderj";
userRouter.get("/request/pending", checkUserAuth, async (req, res) => {
  try {
    //check user authenticated
    //fetch all the connection of loggedInuser where status="interested" and incoming request
    const loggedInuser = req.user._id;
    const userPendingConnection = await ConnectionRequest.find({
      toUserId: loggedInuser,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoURL",
      "age",
      "skills",
      "about",
      ,
    ]);

    const data = userPendingConnection.map((document) => {
      return {
        _id: document._id,
        from: document.fromUserId,
        status: document.status,
      };
    });
    res.json({ data });
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
  }
});
userRouter.get("/request/ongoing/pending", checkUserAuth, async (req, res) => {
  try {
    //check user authenticated
    //fetch all the connection of loggedInuser where status="interested" and incoming request
    const loggedInuser = req.user._id;
    const userPendingConnection = await ConnectionRequest.find({
      fromUserId: loggedInuser,
      status: "interested",
    }).populate("toUserId", [
      "firstName",
      "lastName",
      "photoURL",
      "age",
      "skills",
      "about",
      ,
    ]);
    if (userPendingConnection.length === 0) {
      res.status(404).send("you dont have on going request");
      return;
    }
    const data = userPendingConnection.map((document) => {
      return {
        _id: document._id,
        to: document.toUserId,
        status: document.status,
      };
    });
    res.json({ data });
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
  }
});
userRouter.get("/connection", checkUserAuth, async (req, res) => {
  try {
    //check user authenticated
    //return all the connection available on user data, that means fromUserId:loggedIn user and status=accepted or toUserId:loggedInUsr and status=accepted
    const loggedInUser = req.user._id;
    const userConnection = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser, status: "accepted" },
        { toUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_FILTER)
      .populate("toUserId", USER_FILTER);
    const data = userConnection.map((document) =>
      document.fromUserId._id.toString() === loggedInUser.toString()
        ? document.toUserId
        : document.fromUserId
    );
    res.json({ data });
  } catch (err) {
    res.status(500).send("Something went wrong " + err.message);
  }
});

userRouter.get("/feed", checkUserAuth, async (req, res) => {
  try {
    const loggedIn = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skips = (page - 1) * limit;
    const connectionRequest = await ConnectionRequest.find(
      {
        $or: [{ fromUserId: loggedIn }, { toUserId: loggedIn }],
      },
      { fromUserId: 1, toUserId: 1 }
    );
    const filterOutLoggedInUser = connectionRequest.map((document) =>
      document.fromUserId.toString() === loggedIn.toString()
        ? document.toUserId
        : document.fromUserId
    );
    const userNotMadeConnection = await User.find({
      _id: { $nin: [...filterOutLoggedInUser, loggedIn] },
    })
      .select(USER_FILTER)
      .skip(skips)
      .limit(limit);

    res.send({ data: userNotMadeConnection, limit });
  } catch (err) {
    console.log(err);
  }
});

module.exports = userRouter;
