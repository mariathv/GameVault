const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, "A user must have a email"],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, "Please provide a valid email"]
    },
    username: {
        type: String,
        unique: true,
        requires: [true, "A user must have a name"],
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: 7,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "A user must have a password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "passwords are not same"
        }
    },
    passwordChangedAt: Date
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();

})

const user = mongoose.model("user", userSchema, "user");

module.exports = user