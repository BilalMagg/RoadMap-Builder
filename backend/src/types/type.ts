import { UserEntity } from '../models/user/user.entity';
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
