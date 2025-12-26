import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
export async function checkAuth(req:Request,res:Response,next:NextFunction){
  try {

    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        error: { code: "NO_ACCESS_FOUND", message: "Unauthorized: No token found" } 
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as any;

    req.userId = decoded.id;

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: { code: "ACCESS_TOKEN_EXPIRED", message: "Unauthorized: Access token expired" }
      });
    }
  
    return res.status(401).json({
      message: "Unauthorized: Invalid token"
    });
  }
}
