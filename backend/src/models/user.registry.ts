import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";


const repository = new UserRepository();
const userService = new UserService(repository);
export const userController = new UserController(userService);