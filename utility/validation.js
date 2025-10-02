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
module.exports = { signupValidation, validateLogin };
