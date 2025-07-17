import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import { config } from './config';
import { ROUTES_PATH } from './constants/routesPath';
import { verifyToken } from './middlewares/verifyToken';

dotenv.config();
const app: Application = express();
const port = config.port;
const corsOptions = {
  // origin: ['http://127.0.0.1:5173', 'http://localhost:5173', process.env.FRONTEND_URL as string],
  origin: config.clientBaseUrl,
  credentials: true,
};

// database connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    if (config.mongoUrl) {
      mongoose.connect(config.mongoUrl, {
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

app.use(
  ROUTES_PATH.auth,
  proxy(config.authServiceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log('cookie', srcReq.headers.cookie);
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        cookie: srcReq.headers.cookie || '',
      };
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req) => `${ROUTES_PATH.auth}${req.url}`,
  }),
);
app.use(
  ROUTES_PATH.user,
  verifyToken,
  proxy(config.userServiceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        cookie: srcReq.headers.cookie || '',
      };
      console.log('proxyReqOpts', proxyReqOpts);
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req) => `${ROUTES_PATH.user}${req.url}`,
  }),
);
app.use(
  ROUTES_PATH.tour,
  verifyToken,
  proxy(config.tourServiceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        cookie: srcReq.headers.cookie || '',
      };
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req) => `${ROUTES_PATH.tour}${req.url}`,
  }),
);
app.use(
  ROUTES_PATH.booking,
  verifyToken,
  proxy(config.bookingServiceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        cookie: srcReq.headers.cookie || '',
      };
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req) => `${ROUTES_PATH.booking}${req.url}`,
  }),
);

app.listen(port, () => {
  connectDB();
  console.log('server listening on port: ', port);
});
