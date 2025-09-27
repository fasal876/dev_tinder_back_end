const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Testing from server");
});
// app.use((req, res) => {
//   res.send("hello from server");
// });
app.use("/hello", (req, res) => {
  res.send("hello.......................");
});
app.use("/hello2", (req, res) => {
  res.send("hello.......................");
});
app.use("/hello3", (req, res) => {
  res.send("hello.......................");
});
app.get("/bla", (req, res) => {
  console.log("hei");
  res.send("hi from express");
});
app.use("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("Server is running succesfully on port 3000");
});
