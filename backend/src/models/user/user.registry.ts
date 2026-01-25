import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RefreshTokenRegistry } from '../refreshToken/refreshToken.registry';
import { RoadmapRepository } from '../roadmap/roadmap.repository';

const repository = new UserRepository();
const roadmapRepository = new RoadmapRepository();
export const userService = new UserService(
  repository,
  RefreshTokenRegistry.service,
  roadmapRepository,
);
export const userController = new UserController(userService);
