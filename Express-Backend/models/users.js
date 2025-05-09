const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "A user must have an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "A user must have a username"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: 7,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [function () { return this.isNew; }, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: Date,

    wallet: {
        type: Number,
        default: 0, 
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
userSchema.methods.updateWallet = async function (amount, type = "add") {
    if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
    }

    if (type === "deduct" && this.wallet < amount) {
        throw new Error("Insufficient wallet balance");
    }

    this.wallet += (type === "add" ? amount : -amount);
    await this.save();
};


const user = mongoose.model("user", userSchema, "user");
module.exports = user;
