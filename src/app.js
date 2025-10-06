const express = require("express");
const app = express();
const db = require("./config/db");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
db()
  .then(() => {
    console.log("connected with database");
    app.listen(3000, () => {
      console.log("Server is running succesfully on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
