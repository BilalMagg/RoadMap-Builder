import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
export async function checkAuth(req:Request,res:Response,next:NextFunction){
    const token=req.cookies.accessToken;
    if(!token){
        return  res.status(401).json({
            message:"Unauthorized:No token found"
        });
    }
    try{
        const decoded:any=jwt.verify(token,process.env.JWT_ACCESS_SECRET!);
        req.userId=decoded.id;
        next()
    }catch(err:any){
        if(err.name==="TokenExpiredError"){
            return res.status(401).json({
                message:"Unauthorized:Token expired",
                error: { code: "ACCESS_TOKEN_EXPIRED" }
            });
        }
    }

}