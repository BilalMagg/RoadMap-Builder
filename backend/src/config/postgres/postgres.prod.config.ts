import { DataSource } from "typeorm";
import { IDatabaseConfig } from "../database.interface";
import { UserEntity } from "../../models/user.entity";

export const prodDataSource = new DataSource({
    type: "postgres",
    host:process.env.HOST,
    port:Number(process.env.DB_PROD_PORT),
    username:process.env.DB_PROD_USER,
    password:process.env.DB_PROD_PASSWORD,
    database:process.env.DB_PROD_NAME,
    synchronize:true,
    dropSchema: true,  
    entities: [UserEntity],
});

export class PostgresProdConfig implements IDatabaseConfig{
    getDataSource = () => {
        return prodDataSource;
    }
    async connect(): Promise<void> {
        await prodDataSource.initialize();
        console.log("Database postgres is connected ")
    }
   async disconnect(): Promise<void> {
        await prodDataSource.destroy();
    }
}

