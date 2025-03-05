import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDatabase from "./config/db.js";

const app = express();
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:5173',
    credential: true
}
app.use(cors(corsOptions));


const PORT = process.env.PORT;
app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server is running on port ${PORT}`);
});