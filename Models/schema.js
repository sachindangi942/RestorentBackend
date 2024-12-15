const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true,
      minlength: 2,
    },
    Mobile: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return true;
        },
        message: "validation error message",
      },
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true ,message:"schmea err" },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  });

  const User_schema =  mongoose.model("users", userSchema);
  module.exports = User_schema;


