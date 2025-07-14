import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import { ROUTES_PATH } from './constants/routesPath';

dotenv.config();
const app: Application = express();
const port = process.env.PORT || 8080;
const corsOptions = {
  // origin: ['http://127.0.0.1:5173', 'http://localhost:5173', process.env.CLIENT_BASE_URL as string],
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

// database connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      mongoose.connect(process.env.MONGO_URI, {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
      });
      console.log('MongoDB database is connected');
    }
  } catch (error) {
    console.log('MongoDB database is connection failed', error);
  }
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(ROUTES_PATH.auth, authRoutes);

app.listen(port, () => {
  connectDB();
  console.log('server listening on port: ', port);
});
