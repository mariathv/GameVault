const { promisify } = require('util');
const user = require("../models/users");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const bcrypt = require("bcryptjs");
const mailController = require("./mail.controller")

const signTokken = id => {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

const authController = {
    register: catchAsync(async (req, res) => {
        try {
            const { email, username, password, passwordConfirm, role } = req.body;

            console.log("USER ROLE", role);

            const existingUser = await user.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            if (password !== passwordConfirm) {
                return res.status(400).json({ message: "Passwords do not match" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const token = jwt.sign(
                { email, username, password, passwordConfirm, role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            await mailController.sendVerificationEmail(email, token);

            res.status(200).json({
                status: "pending",
                message: "Check your email to verify and complete registration"
            });

        } catch (err) {
            console.error(err);
            res.status(400).json({
                status: "fail",
                message: err.message,
            });
        }
    }),

    login: catchAsync(async (req, res) => {
        console.log("in login");
        const { email, password } = req.body;

        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password",
            });
        }

        try {
            const existingUser = await user.findOne({ email }).select("+password");

            if (!existingUser) {

                return res.status(401).json({
                    status: "fail",
                    message: "Incorrect email or password",
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordCorrect) {
                console.log("---");
                return res.status(401).json({
                    status: "fail",
                    message: "Incorrect email or password",
                });
            }

            const token = signTokken(existingUser._id);

            // Clean user object for response
            const userObj = existingUser.toObject();
            delete userObj.password;

            console.log(`success login as ${userObj.role}`);
            res.status(200).json({
                status: "success",
                token,
                data: {
                    user: userObj,
                },
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                status: "fail",
                message: "Something went wrong",
            });
        }
    }),
    verifyEmail: catchAsync(async (req, res) => {
        try {
            console.log("verify email");
            const { token } = req.params;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { email, username, password, passwordConfirm } = decoded;
            console.log("dec", decoded);
            const role = "user";

            const existing = await user.findOne({ email });
            if (existing) {
                return res.status(400).send('User already exists');
            }

            const newUser = await user.create({
                email,
                username,
                password,
                passwordConfirm,
                role,
                isVerified: true
            });

            res.status(201).send('Email verified! Your account is now active.');
        } catch (err) {
            console.error(err);
            res.status(400).send('Invalid or expired verification link');
        }
    }),

    protect: catchAsync(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError("You are not logged in! Please login in to get access", 401));
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const freshUser = await user.findById(decoded.id)
        if (!freshUser) {
            console.log("The user belonging to this token no longer exist");
            return next(new AppError("The user belonging to this token no longer exist", 401));
        }

        if (freshUser.changedPasswordAfter(decoded.iat)) {
            console.log("user recently changed password! please login again");
            return next(new AppError('user recently changed password! please login again', 401))
        }
        req.user = freshUser;
        next()
    }),
    restrictTo: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(new AppError("You don't have permission to perform this action", 403));
            }
            next();
        };
    },
    getMe: catchAsync(async (req, res, next) => {
        const userData = req.user.toObject();
        delete userData.password;

        res.status(200).json({
            status: "success",
            data: {
                user: userData,
            },
        });
    }),


};

module.exports = authController;