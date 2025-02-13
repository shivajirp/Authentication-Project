import express from "express";
import { login, logout, signup, verifyMail, forgotPassword } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup", signup)
router.post("/verify-email", verifyMail)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forgot-password", forgotPassword)

export default router;