import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDatabase from "./config/db.js";
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';

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

app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server is running on port ${PORT}`);
});