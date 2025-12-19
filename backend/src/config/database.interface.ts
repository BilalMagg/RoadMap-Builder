import { DataSource } from "typeorm";

export interface IDatabaseConfig {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getDataSource(): DataSource;
}