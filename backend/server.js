import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import connectMongoDB from './db/createMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })) // to parse url encoded data

// console.log(process.env.MONGO_URI);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
  connectMongoDB();
})