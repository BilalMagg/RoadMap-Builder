import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AllRoutes } from './routes/index.route';
import { corsOptions } from './utils/corsConfig';


import helmet from 'helmet';
import morgan from 'morgan';
const app = express();
app.set('trust proxy', true);

app.use(helmet());

app.use(morgan('dev'));
app.set('json spaces', 2);
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log('=== Request Details ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Origin:', req.headers.origin);
  console.log('Referer:', req.headers.referer);
  console.log('Host:', req.headers.host);
  console.log('Secure (req.secure):', req.secure);
  console.log('X-Forwarded-Proto:', req.headers['x-forwarded-proto']);
  console.log('Cookies:', req.cookies);
  console.log('=====================\n');
  next();
});

app.use('/api', AllRoutes);

export default app;
