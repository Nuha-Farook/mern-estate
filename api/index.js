import express  from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const mongoUri = process.env.MONGO?.trim();

if (!mongoUri) {
    console.error('MongoDB connection failed: MONGO is missing from the .env file.');
    process.exitCode = 1;
} else {
    mongoose.connect(mongoUri)
        .then(() => {
            console.log('connected to MongoDB');
            app.listen(3000, () => {
                console.log('server is running on port 3000');
            });
        })
        .catch((error) => {
            console.error('error connecting to MongoDB:', error.message);
            process.exitCode = 1;
        });
}

  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);
  app.use('/api/listing', listingRouter);
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internet Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,

    });
  })

