const { Chat } = require("../models/chat");
const User = require("../models/user");

const initializeSocket = (server) => {
  const { createServer } = require("http");
  const { Server } = require("socket.io");

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ fromUserId, toUserId }) => {
      const room = [fromUserId, toUserId].sort().join("_");
      socket.join(room);
    });

    //listen on sendingMessage from client
    socket.on(
      "sendMessage",
      async ({ firstName, fromUserId, toUserId, text }) => {
        try {
          const room = [fromUserId, toUserId].sort().join("_");

          let chat = await Chat.findOne({
            participants: { $all: [fromUserId, toUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [fromUserId, toUserId],
              message: [],
            });
          }
          chat.message.push({ senderId: fromUserId, text });
          await chat.save();
          const user = await User.findOne({ _id: fromUserId }).select(
            "photoURL"
          );
          io.to(room).emit("recievedMessage", {
            sender: fromUserId,
            photoURL: user.photoURL,
            text,
            timeStamp: new Date(),
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
  });
};

module.exports = initializeSocket;
