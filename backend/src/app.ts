import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { AllRoutes } from "./routes/index.route";
dotenv.config();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}

const app = express();

app.set('json spaces', 2);
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api',AllRoutes);
export default app;