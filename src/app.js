const express = require("express");
const app = express();
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRoute = require("./routes/chat");
//const cronjob = require("./utility/cron");
const initializeSocket = require("./utility/socket");
require("dotenv").config();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRoute);

const { createServer } = require("http");
const server = createServer(app);
initializeSocket(server);
db()
  .then(() => {
    console.log("connected with database");
    server.listen(process.env.PORT, () => {
      console.log("Server is running succesfully on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
