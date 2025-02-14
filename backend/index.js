import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./db/connectDB.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json());  //allows to parse incoming requests from req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server listening at port: ", PORT)
})