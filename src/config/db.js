const mongoos = require("mongoose");

const connectDB = async () => {
  const db = await mongoos.connect(process.env.DATA_BASE_SECRET);

  return db;
};

module.exports = connectDB;
