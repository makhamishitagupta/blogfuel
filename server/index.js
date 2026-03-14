import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';

// routes
import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';
import announcementRouter from './routes/announcement.route.js';
import commentRouter from './routes/comment.route.js';
import errorMiddleware from './middleware/error.middleware.js';
import AppError from './utils/appError.js';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true,
  optionsSuccessStatus: 200,
};

// middlewares
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: false,
}));
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/announcement', announcementRouter);
app.use('/comment', commentRouter);

app.get('/', (req, res) => {
    res.send("Hello World");
});

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorMiddleware);

// connect to DB and start server
const start = async () => {
    const DB_URL = process.env.MONGO_DB_URL;

    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to DB");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to DB:", err);
        process.exit(1);
    }
}

start();