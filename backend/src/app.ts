import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { AllRoutes } from "./routes/index.route";
dotenv.config();
import helmet from 'helmet';
import morgan from 'morgan';
const app = express();
app.use(helmet());

app.use(morgan('dev'));
app.set('json spaces', 2);
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/api',AllRoutes);
export default app;