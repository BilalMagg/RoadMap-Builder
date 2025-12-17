import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors'
import { DatabaseFactory } from "./config/database.factory";
import { AllRoutes } from "./routes/index.route";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

app.use('/api',AllRoutes);


async function start() {
  try {
   console.log('Mot de passe depuis .env:', process.env.DB_PASSWORD);


    const dbConfig = DatabaseFactory.getConfiguration();
    await dbConfig.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("❌ Erreur lors du démarrage :", error);
    process.exit(1);
  }
}

start();