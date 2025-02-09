import { User } from "../models/user.model.js";

const signup = async (req,res) => {
    // res.send("Signup route");
    const{email, password, name} = req.body;
    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = User.findOne({email});
        if(userAlreadyExists) {
            throw new Error("User already exists")
        }
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