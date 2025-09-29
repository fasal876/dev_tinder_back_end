const mongoos = require("mongoose");

const connectDB = async () => {
  await mongoos.connect(
    "mongodb+srv://muhammedfasalkp710_db_user:CSPeQW5N9ABfrcvP@cluster0.vif0vn8.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
