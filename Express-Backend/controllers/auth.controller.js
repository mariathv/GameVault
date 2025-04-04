const { promisify } = require('util');
const user = require("../models/users");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const bcrypt = require("bcryptjs");

const signTokken = id => {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

const authController = {
    register: catchAsync(async (req, res) => {
        try {

            console.log("in reg");
            const newUser = await user.create({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
                role: req.body.role
            });

            const token = signTokken(newUser._id)
            console.log("success register", token);
            res.status(201).json({
                status: "success",
                token,
                data: {
                    user: newUser,
                },
            });
        } catch (err) {
            console.log(err.message);
            res.status(400).json({
                status: "fail",
                data: {
                    err,
                },
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
            return next(new AppError("The user belonging to this token no longer exist", 401));
        }

        if (freshUser.changedPasswordAfter(decoded.iat)) {
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