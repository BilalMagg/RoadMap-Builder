import { IDatabaseConfig } from "./database.interface";
import { PostgresConfig } from "./postgres/postgres.config";
import { PostgresTestConfig } from "./postgres/postgres.test.config";


export class DatabaseFactory {
  static getDevConfiguration(): IDatabaseConfig {
    const dbType = process.env.DB_DEV_TYPE; 
    switch(dbType){
        case 'postgres' : return new PostgresConfig();
    
        default:
        throw new Error(`Database type "${dbType}" is not supported. Please check your .env file.`);
    }
  }
  static getTestConfiguration(): IDatabaseConfig {
    const dbType = process.env.DB_TEST_TYPE; 
    switch(dbType){
        case 'postgres' : return new PostgresTestConfig();
        default:
        throw new Error(`Database type "${dbType}" is not supported. Please check your .env file.`);
    }
    
  }
  static getProdConfiguration(): IDatabaseConfig {
    const dbType = process.env.DB_PROD_TYPE; 
    switch(dbType){
        case 'mongo' : return new PostgresConfig();
        default:
        throw new Error(`Database type "${dbType}" is not supported. Please check your .env file.`);
    }
    
  }
}