import { api } from "./axios";
import { setupInterceptors } from "./apiInterceptors";

setupInterceptors();

export { api }; 