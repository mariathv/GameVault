const user = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authController = {
    register: async (req, res) => {
        try {

            console.log("in reg");
            const newUser = await user.create({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
            });

            const token = jwt.sign({ id: newUser._id }, "your_jwt_secret", {
                expiresIn: "7d",
            });
            console.log("success register");
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
    },

    login: async (req, res) => {
        console.log("in login");
        const { email, password } = req.body;

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
                return res.status(401).json({
                    status: "fail",
                    message: "Incorrect email or password",
                });
            }

            const token = jwt.sign({ id: existingUser._id }, "your_jwt_secret", {
                expiresIn: "7d",
            });
            console.log("success login");
            res.status(200).json({
                status: "success",
                token,
                data: {
                    user: existingUser,
                },
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                status: "fail",
                message: "Something went wrong",
            });
        }
    }
};

module.exports = authController;