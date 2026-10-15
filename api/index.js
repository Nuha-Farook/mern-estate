import express  from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

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

