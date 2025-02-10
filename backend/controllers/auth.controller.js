import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.utils.js";
import { User } from "../models/user.model.js";

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

const login = async (req,res) => {
    res.send("Login route");
}

const logout = async (req,res) => {
    res.send("Logout route");
}

export {
    signup,
    login,
    logout
}