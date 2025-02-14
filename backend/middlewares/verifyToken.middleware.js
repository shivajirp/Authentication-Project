import jwt from "jsonwebtoken";

// get token from cookies
// decode using jwt verify
// get userId
// go next

export const verifyToken = async(req,res, next) => {
    const token = req.cookies.token;

    if(!token) {
        res
        .status(400)
        .json({
            success: false,
            message: "Unauthorized - token not provided"
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(!decoded) {
            res
            .status(400)
            .json({
                success: false,
                message: "Unauthorized - invalid token"
            })
        }

        req.userId = decoded.userId
        next();

    } catch (error) {
        console.log("Error in verifyToken", error)
        return res
        .status(500)
        .json({
            success: false,
            message: "Server Error"
        })
    }
}