import { DataSource } from 'typeorm';
import { IDatabaseConfig } from '../database.interface';
import { UserEntity } from '../../models/user/user.entity';
import { RefreshTokenEntity } from '../../models/refreshToken/refreshToken.entity';
import { RoadmapEntity } from '../../models/roadmap/roadmap.entity';
import { RoadmapEventEntity } from '../../models/roadmap-event/roadmap-event.entity';
import { RoadmapProgressEntity } from '../../models/roadmap_progress/roadmap_progress.entity';
console.log('DB URL:', process.env.DATABASE_PROD_URL);
export const prodDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_PROD_URL,
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: false,
  logging: false,
  entities: [
    UserEntity,
    RefreshTokenEntity,
    RoadmapEntity,
    RoadmapEventEntity,
    RoadmapProgressEntity
  ],
});


export class PostgresProdConfig implements IDatabaseConfig {
  getDataSource = () => {
    return prodDataSource;
  };
  async connect(): Promise<void> {
    await prodDataSource.initialize();
    console.log('Database postgres is connected ');
  }
  async disconnect(): Promise<void> {
    await prodDataSource.destroy();
  }
}
