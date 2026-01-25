import { UserEntity } from '../user.entity';
import { UserRequestDto } from '../user.dto';

export interface IUserRepository {
  save(user: UserRequestDto): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
}
