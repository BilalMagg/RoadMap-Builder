import { Repository } from "typeorm";
import { AppDataSource } from "../config/postgres.config"; // Ton DataSource TypeORM
import { UserEntity } from "./user.entity";
import { IUserRepository } from "../interface/user/user.repository.interface";
import { UserRequestDto } from "./user.dto";

export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async save(userData: UserRequestDto): Promise<UserEntity> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }
   async findByUsername(username: string): Promise<UserEntity | null> {
      return await this.repository.findOne({where:{username}});
  }
}