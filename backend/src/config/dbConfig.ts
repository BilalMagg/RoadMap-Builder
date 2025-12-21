import { IDatabaseConfig } from "./database.interface";
import { DatabaseFactory } from "./database.factory";


const env = process.env.NODE_ENV || "test" ;
const DEV = process.env.ENV_DEV;
const TEST = process.env.ENV_TEST;
const PROD = process.env.ENV_PROD;
console.log("Env choice : ",env);


const linkDataSource = () : IDatabaseConfig => {

    switch (env) {
        case DEV: 
            return DatabaseFactory.getDevConfiguration();
        case TEST:
            return DatabaseFactory.getTestConfiguration();
        case PROD:
            return DatabaseFactory.getProdConfiguration();
        default:
            return DatabaseFactory.getDevConfiguration();
    }
}

export const AppDataSource : IDatabaseConfig = linkDataSource();








