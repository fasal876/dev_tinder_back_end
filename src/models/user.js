const mongoose = require("mongoose");
const { isEmail, isURL, isStrongPassword } = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
      match: /^[a-zA-Z'-]+(?: [a-zA-Z]+)*$/,
    },
    lastName: {
      type: String,
      maxLength: 50,
      match: /^[a-zA-Z'-]+$/,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Invalid email id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        {
          if (!isStrongPassword(value)) {
            throw new Error("Please enter a strong password");
          }
        }
      },
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
      validate(value) {
        if (!isURL(value)) {
          throw new Error("please enter valid url");
        }
      },
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
