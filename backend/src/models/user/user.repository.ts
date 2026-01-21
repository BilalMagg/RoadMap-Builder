import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { IUserRepository } from "./interface/user.interface";
import { UserRequestDto } from "./user.dto";
import { AppDataSource } from "../../config/dbConfig";

export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

          constructor() {
            this.repository = AppDataSource.getDataSource().getRepository(UserEntity);
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