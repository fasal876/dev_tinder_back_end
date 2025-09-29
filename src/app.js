const express = require("express");
const app = express();

app.use("/admin", (req, res, next) => {
  const token = "xyz";
  const isAdmin = "xyz" === token;
  if (isAdmin) {
    next();
  } else {
    res.statusCode(401).send("unauthorized request");
  }
});
app.get("/user", (req, res, next) => {
  console.log("hander1");
  next();
});
app.get("/user", (req, res) => {
  console.log("handler 2");
  res.send("req handler 2");
});

app.get("/getData", (req, res) => {
  throw new Error("Error");
});
//or
app.get("/get", (req, res) => {
  try {
    throw new Error("erro");
  } catch (err) {
    res.status(501).send("Internal server erro");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.statusCode(501).send("Internal server err");
  }
});
app.get("/admin/getData", (req, res) => {
  //check if it is admin after fething data base or token
  res.send("data collected");
});
app.get("/admin/deleteData", (req, res) => {
  res.send("data deleted");
});

//we can multiple route handler to a path , next() is funciton is used call sucseeding handlers
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
  // the functions that are in between request and response known as middlewares
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
    //this function knows as rout handler because it handle the actual response
    console.log("req handler 4");
    //next();
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
