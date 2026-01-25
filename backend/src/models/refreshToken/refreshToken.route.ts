import { Router } from "express";
import { RefreshTokenRegistry } from "./refreshToken.registry";

const routerRef = Router();


routerRef.post("/refresh", (req, res) => {RefreshTokenRegistry.controller.refresh(req, res)});

export default routerRef;