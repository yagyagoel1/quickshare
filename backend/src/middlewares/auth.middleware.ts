import { Request, Response, Router } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { ipManagement } from "../utils/IPmanagement"
import { ApiResponse } from "../utils/apiResponse"

declare global {
    namespace Express {
      interface Request {
        ipDetails?: {
          ip: string;
          used: number;
        };
      }
    }
  }

export const authMiddleware = asyncHandler(async (req:Request, res:Response, next) => {
    
    if(!req.ip){
        return res.status(400).json(new ApiResponse(400,"ip address not found"))
    }
    const ipExist = ipManagement.checkIp(req.ip)
    req.ipDetails = ipExist
    if(req.ip==="::1"){
        next()
    }
    
    else if(ipExist && ipExist.used>5){
        return res.status(400).json(new ApiResponse(429,"already used your quota come back tommorrow for more"))
    }

    else if(!ipExist){
        ipManagement.addIp({ip:req.ip,used:0})
        next()
    }
    else{
        next()
    }
    
})