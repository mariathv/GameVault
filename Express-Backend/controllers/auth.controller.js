const { promisify } = require('util');
const user = require("../models/users");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const bcrypt = require("bcryptjs");
const mailController = require("./mail.controller")
const TwoFactorCode = require("../models/twofactorcode")

const signTokken = id => {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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

            console.log(existingUser);
            console.log(existingUser.twoFactorEnabled);

            if (existingUser.twoFactorEnabled) {
                try {
                    console.log("2fa checkk")
                    const code = generateVerificationCode();

                    await TwoFactorCode.deleteMany({ userId: existingUser._id });

                    await TwoFactorCode.create({
                        userId: existingUser._id,
                        code
                    });

                    await mailController.send2FACode(existingUser.email, code);

                    // Create a temporary token that only contains the user ID
                    // This token will be used to identify the user during 2FA verification
                    const tempToken = jwt.sign(
                        { id: existingUser._id, require2FA: true },
                        process.env.JWT_SECRET,
                        { expiresIn: '30m' }
                    );

                    return res.status(200).json({
                        message: 'Two-factor authentication required',
                        tempToken,
                        require2FA: true
                    });
                } catch (err) {
                    console.log(err.message);
                    if (!res.headersSent) {
                        return res.status(500).json({
                            status: "fail",
                            message: "Something went wrong",
                        });
                    }
                }
            }


            const token = signTokken(existingUser._id);

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
    send2FAuthCode: async (req, res) => {
        try {
            // Get user ID from the temporary token
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const token = authHeader.split(' ')[1];
            let decoded;

            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            if (!decoded.require2FA) {
                return res.status(400).json({ message: 'Two-factor authentication not required' });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate and store new 2FA code
            const code = generateVerificationCode();

            // Delete any existing codes for this user
            await TwoFactorCode.deleteMany({ userId: user._id });

            await TwoFactorCode.create({
                userId: user._id,
                code
            });

            // Send code via email
            const emailSent = await mailController.send2FACode(user.email, code);

            if (!emailSent) {
                return res.status(500).json({ message: 'Failed to send verification code' });
            }

            res.status(200).json({ message: 'Verification code sent successfully' });
        } catch (error) {
            console.error('Send 2FA code error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    verify2FA: async (req, res) => {
        try {
            const { code } = req.body;

            console.log("code", code);
            const codeStr = String(code);

            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized' });
            }


            const token = authHeader.split(' ')[1];
            console.log(token)
            let decoded;

            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            if (!decoded.require2FA) {
                return res.status(400).json({ message: 'Two-factor authentication not required' });
            }

            const userfound = await user.findById(decoded.id);
            if (!userfound) {
                return res.status(404).json({ message: 'User not found' });
            }

            const storedCode = await TwoFactorCode.findOne({ userId: userfound._id });
            if (!storedCode) {
                return res.status(400).json({ message: 'Verification code expired or not found' });
            }

            console.log(storedCode.code, codeStr, code)
            if (storedCode.code !== codeStr) {
                return res.status(401).json({ message: 'Invalid verification code' });
            }
            await TwoFactorCode.deleteOne({ _id: storedCode._id });

            const fullToken = jwt.sign(
                { id: userfound._id, email: userfound.email, role: userfound.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            const userObj = userfound.toObject();
            delete userObj.password;

            res.status(200).json({
                message: 'Two-factor authentication successful',
                status: "success",
                token: fullToken,
                data: {
                    user: userObj,
                },
            });
        } catch (error) {
            console.error('Verify 2FA code error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    toggle2FA: async (req, res) => {
        try {
            const userId = req.user.id;

            const userfound = await user.findById(userId);
            if (!userfound) {
                return res.status(404).json({ message: 'User not found' });
            }

            userfound.twoFactorEnabled = !userfound.twoFactorEnabled;
            await userfound.save();

            res.status(200).json({
                message: `Two-factor authentication ${userfound.twoFactorEnabled ? 'enabled' : 'disabled'}`,
                twoFactorEnabled: user.twoFactorEnabled
            });
        } catch (error) {
            console.error('Toggle 2FA error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
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