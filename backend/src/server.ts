import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/dbConfig";
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    
    const dbConfig = AppDataSource;
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