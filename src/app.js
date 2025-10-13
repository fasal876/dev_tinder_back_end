const express = require("express");
const app = express();
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
require("dotenv").config();
const cors = require("cors");
const { configDotenv } = require("dotenv");
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
db()
  .then(() => {
    console.log("connected with database");
    app.listen(process.env.PORT, () => {
      console.log("Server is running succesfully on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
