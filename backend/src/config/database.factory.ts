import { IDatabaseConfig } from "./database.interface";
import { PostgresConfig } from "./postgres.config";


export class DatabaseFactory {
  static getConfiguration(): IDatabaseConfig {
    const dbType = process.env.DB_TYPE; 
    switch(dbType){
        case 'postgres' : return new PostgresConfig();
        default:
        throw new Error(`Database type "${dbType}" is not supported. Please check your .env file.`);
    }
    
  }
}