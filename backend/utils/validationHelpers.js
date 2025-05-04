// utils/validationHelpers.js

// Validates if a string is a 24-character hexadecimal string (MongoDB ObjectId format)
const isValidObjectId = (val) => /^[0-9a-fA-F]{24}$/.test(val);

module.exports = {
  isValidObjectId,
};
