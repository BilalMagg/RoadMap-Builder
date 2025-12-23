import { DataSource } from "typeorm";
import { IDatabaseConfig } from "../database.interface";
import { UserEntity } from "../../models/user/user.entity";
import dotenv from 'dotenv'
import { RefreshTokenEntity } from "../../models/refreshToken/refreshToken.entity";
dotenv.config();

console.log('Mot de passe depuis .env:', process.env.DB_PASSWORD);
console.log('Mot de passe depuis .env:', process.env.DB_USER);

const appDataSource = new DataSource({
    type:"postgres",
    host:process.env.HOST,
    port:Number(process.env.DB_PORT),
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    synchronize:true,
    logging:false,
    entities:[UserEntity,RefreshTokenEntity],
    subscribers:[],
    migrations:[]
})

export class PostgresConfig implements IDatabaseConfig{
    getDataSource = () => {
        return appDataSource;
    }

    async connect(): Promise<void> {
        await appDataSource.initialize();
        console.log("Database postgrs is connected ")
    }
   async disconnect(): Promise<void> {
        await appDataSource.destroy();
    }
}
