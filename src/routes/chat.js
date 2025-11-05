const express = require("express");
const { checkUserAuth } = require("../middlewares/checkUserAuth");
const { Chat } = require("../models/chat");
const { Connection } = require("mongoose");
const chatRoute = express.Router();
chatRoute.get("/:toUserId", checkUserAuth, async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const connectionExist = Connection.findOne({
      $or: [
        { fromUserId: req.user._id, toUserId, status: "accepted" },
        { fromUserId: toUserId, toUserId: req.user._id, status: "accepted" },
      ],
    });
    if (!connectionExist) {
      return res
        .status(403)
        .json({ message: "please connect with before you send" });
    }
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, toUserId] },
    }).populate({
      path: "message.senderId",
      select: "photoURL",
    });
    if (!chat) {
      chat = new Chat({ participants: [req.user._id], message: [] });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {}
});

module.exports = chatRoute;
