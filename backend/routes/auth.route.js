import express from "express";
import { login, logout, signup, verifyMail, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router()

router.post("/signup", signup)
router.post("/verify-email", verifyMail)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.get("/check-auth", verifyToken, checkAuth)

export default router;