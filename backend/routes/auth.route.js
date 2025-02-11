import express from "express";
import { login, logout, signup, verifyMail } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup", signup)
router.post("/verify-email", verifyMail)
router.post("/login", login)
router.post("/logout", logout)

export default router;