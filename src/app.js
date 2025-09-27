const express = require("express");
const app = express();

app.use(
  "/users1",
  (req, res, next) => {
    console.log("req handler 1");
    next();
  },
  (req, res) => {
    console.log("req handler 2");
    res.send("request handler 2");
  }
);

app.use(
  "/users2",
  (req, res, next) => {
    console.log("req handler 1");
    res.send("req handler 1");
    next();
  },
  (req, res) => {
    console.log("req handler 2");
    res.send("request handler 2");
  }
);
app.use(
  "/users3",
  (req, res, next) => {
    console.log("req handler 1");
    next();
    res.send("req handler 1");
  },
  (req, res) => {
    console.log("req handler 2");
    res.send("request handler 2");
  }
);
app.use(
  "/users4",
  (req, res, next) => {
    console.log("req handler 1");
    next();
  },
  (req, res, next) => {
    console.log("req handler 2");
    next();
  },
  (req, res, next) => {
    console.log("req handler 3");
    next();
  },
  (req, res, next) => {
    console.log("req handler 4");
    next();
    res.send("fsjdf");
  }
);
app.use(
  "/users",
  (req, res) => {
    console.log("req handler 1");
  },
  (req, res) => {
    console.log("req handler 1");
  }
);

app.listen(3000, () => {
  console.log("Server is running succesfully on port 3000");
});
