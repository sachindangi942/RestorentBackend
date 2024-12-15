const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        minlength: 2,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
    confirmPassword : {type: String, required: true},
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    create_by: { type: String },
});
const User_Schema = mongoose.model("RestroUsers", userSchema);
module.exports = User_Schema;
