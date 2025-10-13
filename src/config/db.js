const mongoos = require("mongoose");

const connectDB = async () => {
  await mongoos.connect(process.env.DATA_BASE_SECRET);
};

module.exports = connectDB;
