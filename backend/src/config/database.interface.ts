export interface IDatabaseConfig {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}