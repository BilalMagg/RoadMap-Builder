import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { AllRoutes } from "./routes/index.route";
dotenv.config();

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/api',AllRoutes);
export default app;