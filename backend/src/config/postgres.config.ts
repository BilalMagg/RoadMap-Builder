import { DataSource } from "typeorm";
import { IDatabaseConfig } from "./database.interface";
import { UserEntity } from "../models/user.entity";
export const AppDataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:5432,
    username:"postgres",
    password:"said1234",
    database:"roadmap",
    synchronize:true,
    logging:true,
    entities:[UserEntity],
    subscribers:[],
    migrations:[]
})

export class PostgresConfig implements IDatabaseConfig{
    async connect(): Promise<void> {
        await AppDataSource.initialize();
        console.log("Database postgrs is connected ")
    }
   async disconnect(): Promise<void> {
        await AppDataSource.destroy();
    }
}
