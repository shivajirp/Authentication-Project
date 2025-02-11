import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.utils.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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
    res.send("Login route");
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

export {
    signup,
    login,
    logout,
    verifyMail
}