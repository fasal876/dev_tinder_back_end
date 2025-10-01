const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate: (v) => {
        if (!["male", "female", "other"].includes(v)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 80,
    },
    photoURL: {
      type: String,
      default:
        "https://premierleasing.com.bd/wp-content/uploads/2023/09/dummy-profile-pic.jpg",
    },
    about: {
      type: String,
      default: "This default about of Developer",
      maxLength: 200,
    },
    skills: {
      type: [String],
      validate(v) {
        if (v.length > 30) {
          throw new Error("You cannot add skills more than 30");
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
