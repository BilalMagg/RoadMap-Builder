import { DataSource } from "typeorm";
import { IDatabaseConfig } from "../database.interface";
import { UserEntity } from "../../models/user.entity";

export const testDataSource = new DataSource({
    type: "postgres",
    host:process.env.HOST,
    port:Number(process.env.DB_TEST_PORT),
    username:process.env.DB_TEST_USER,
    password:process.env.DB_TEST_PASSWORD,
    database:process.env.DB_TEST_NAME,
    synchronize:true,
    dropSchema: true,  
    logging:true,
    entities: [UserEntity],
});

export class PostgresTestConfig implements IDatabaseConfig{
    getDataSource = () :DataSource => {
        return testDataSource;
    }
    async connect(): Promise<void> {
        await testDataSource.initialize();
        console.log("Database postgres is connected ")
    }
   async disconnect(): Promise<void> {
        await testDataSource.destroy();
    }
}

