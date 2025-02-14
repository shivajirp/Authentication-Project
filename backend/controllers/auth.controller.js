import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.utils.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendPasswordResetSuccess } from "../mailtrap/emails.js";

const signup = async (req,res) => {
    // res.send("Signup route");
    const{email, password, name} = req.body;
    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            throw new Error("User already exists")
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000  // 24 hours
        })

        await newUser.save();
        console.log(newUser);
        
        generateTokenAndSetCookie(res, newUser._id);

        await sendVerificationEmail(newUser.email, verificationToken);

        // 201 - something is created
        res
        .status(201)
        .json({
            success: true,
            message: "User created successfully",
            user : {
                ...newUser._doc,
                password: undefined
            }
        });

    } catch (error) {
        return res
        .status(400)
        .json({
            success: false,
            message: error.message,
        })
    }
}

const verifyMail = async (req,res) => {
    const {code} = req.body

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if(!user) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid or expired verification code"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save()

        await sendWelcomeEmail(user.email, user.name)

        return res
        .status(200)
        .json({
            success: true,
            message: "User verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    
    } catch (error) {
        console.error("Error verifying the email", error)
        return res
        .status(400)
        .json({
            success: false,
            message: "server error",
        })
    }
}

const login = async (req,res) => {
    // res.send("Login route");
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        
        console.log("problem in bcrypt")
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        console.log("no not in bcrypt")
        
        if(!isPasswordValid) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date()

        return res
        .status(200)
        .json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        console.log("Error while logging in ", error);

        return res
        .status(400)
        .json({
            success: false,
            message: error.message,
        })

    }
}

const logout = async (req,res) => {
    res
    .status(200)
    .clearCookie("token")
    .json({
        success: true,
        message: "User Logged Out Successfully"
    })
}

const forgotPassword = async (req,res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            throw new Error("invalid credentials")
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;  //1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT}/reset-password/${resetToken}`);

        return res
        .status(200)
        .json({
            success: true,
            message: "Password reset link sent to your email"
        })

    } catch (error) {
        console.log("Invalid user credentials")

        res
        .status(400)
        .json({
            success: false,
            message: "Invalid user credentials"
        })
    }
}

const resetPassword = async(req,res) => {
    // get token
    // get new password
    // find user using token
    // hash password
    // update user password, resetPassword Token and it expiration time
    // save the user
    // send reset success mail
    
    const {token} = req.params;
    const {password} = req.body;
    try {
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        })
    
        if(!user) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid or expired token"
            })
        }
    
        const hashedPassword = await bcryptjs.hash(password, 10);
    
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
    
        user.save();
    
        await sendPasswordResetSuccess(user.email);

        res
        .status(200)
        .json({
            success: true,
            message: "Reset password successful",
        })

    } catch (error) {
        console.log("Error resetting the password")
        res
        .status(400)
        .json({
            success: false,
            message: error.message
        })
    }
}

const checkAuth = async(req,res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");
    
        if(!user) {
            return res
            .status(400)
            .json({
                success: false,
                message: "User not found"
            })
        }
        
        return res
        .status(200)
        .json({
            success: true,
            user
        })

    } catch (error) {
        console.log("Error in check-auth", error);

        return res
            .status(400)
            .json({
                success: false,
                message: error.message
            })
    }
}

export {
    signup,
    login,
    logout,
    verifyMail,
    forgotPassword,
    resetPassword,
    checkAuth
}