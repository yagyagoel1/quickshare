import e, { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ipManagement } from "../utils/IPmanagement";



const ifLimitReached = asyncHandler(async(req:Request,res:Response)=>{
    if(!req.ip){
        return res.status(400).json(new ApiResponse(400,"ip address not found"))
    }
    const ipExist = ipManagement.checkIp(req.ip)
    if(req.ip==="::1"){
        return res.status(200).json(new ApiResponse(200,"ip address not found"))
    }
    
    else if(ipExist && ipExist.used>5){
        return res.status(400).json(new ApiResponse(429,"already used your quota come back tommorrow for more"))
    }

    else if(!ipExist){
        ipManagement.addIp({ip:req.ip,used:0})
        return res.status(200).json(new ApiResponse(200,"Added the IP address"))
    }
    else{
        return res.status(200).json(new ApiResponse(200,"IP address already exists",{used:ipExist.used}))
    }
});

const isFileSmallEnough = asyncHandler(async(req:Request,res:Response,next:Function)=>{
    const size = req.body;
    if(!req.ip){
        return res.status(400).json(new ApiResponse(400,"ip address not found"))
    }
    
    if(!size){
        return res.status(400).json(new ApiResponse(400,"file size should exist"))
    }
    if(size>5){
        return res.status(400).json(new ApiResponse(400,"file is too big for your left limit please upgrade your plan to upload bigger files"))
    }
    else if(req.ipDetails?.used+size > 5){
        return res.status(400).json(new ApiResponse(400,"file is too big for your left limit please upgrade your plan to upload bigger files"))
    }
    else{
        ipManagement.addUsed(req.ip,size)
        return  res.status(200).json(new ApiResponse(200,"file is small enough to be uploaded"))
    }
})

export {ifLimitReached,isFileSmallEnough}