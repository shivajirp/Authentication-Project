import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./db/connectDB.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(cors({
    origin: "https://authentication-project-e87w.onrender.com/",
    credentials: true
}))
app.use(express.json());  //allows to parse incoming requests from req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server listening at port: ", PORT)
})