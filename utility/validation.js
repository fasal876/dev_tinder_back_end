const { isEmail, isStrongPassword } = require("validator");
const signupValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("names are missing");
  }
  if (!emailId || !isEmail(emailId)) {
    throw new Error("Enter a valid email");
  }
  if (!password || !isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};
const validateLogin = (req) => {
  const { emailId } = req.body;
  if (!emailId || !isEmail) {
    throw new Error("Enter a valid email");
  }
};

const validateUpdateRequest = (req) => {
  const allowedFields = new Set([
    "firstName",
    "lastName",
    "age",
    "photoURL",
    "about",
    "skills",
  ]);
  const isValid = Object.keys(req.body).every((field) =>
    allowedFields.has(field)
  );
  return isValid;
};
const validateUpdatePassword = (req) => {
  const keys = Object.keys(req.body);
  const validFileds = keys.length == 1 && keys[0] === "password";
  if (!validFileds) {
    throw new Error("Invalid fields");
  }
  if (!isStrongPassword(req.body[keys[0]])) {
    throw new Error("Please enter a strong password");
  }
};
module.exports = {
  signupValidation,
  validateLogin,
  validateUpdateRequest,
  validateUpdatePassword,
};
