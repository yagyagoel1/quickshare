import { asyncHandler } from "../utils/asyncHandler";
import AWS from "aws-sdk"
import {Response,Request } from "express"
import { ApiResponse } from "../utils/apiResponse";
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY ,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  });
  const bucketName = process.env.AWS_BUCKET||"";
  


const startUpload = asyncHandler(async(req:Request,res:Response)=>{
    try {
        if (!req.body || typeof req.body.fileName !== 'string') {
            return res.status(400).json(new ApiResponse(400,"filename should exist and should be of type string",{}));
        }
        const { fileName }:{fileName:string} = req.body;
        const params = {
          Bucket: bucketName,
          Key: fileName,
        };
        console.log("initiated")
        const upload = await s3.createMultipartUpload(params).promise();
        if(!upload){
           return  res.status(400).json(new ApiResponse(400,"there was some problem initiating multipartupload",{}))
        }
       return  res.status(200).json(new ApiResponse(200,"upload details fetched successfully",{ uploadId: upload.UploadId }));
      } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500,"there was some problem initiating multipartupload",{}));
      }
})

const uploadChunk =  asyncHandler(async(req:Request,res:Response)=>{
  const {index,fileName}:{index:string,fileName:string}= req.body;
  if(!index && typeof index!="string"){
    return res.status(400).json(new ApiResponse(400,"there should be an index of type string"))
  }
  if(!fileName&&fileName!="string"){
    return res.status(400).json(new ApiResponse(400,"there should be an fileName of type string"))

  }
  const file =req.file;
  if(!file){
    return res.status(400).json(new ApiResponse(400,"please upload a file"))
  }
  if(!req.query.uploadId){
    return res.status(400).json(new ApiResponse(400,"please specify the upload id in the parameter"))
  }
  const uploadId = String(req.query.uploadId)
  const s3Params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    PartNumber: Number(index) + 1,
    UploadId: uploadId
  };
  s3.uploadPart(s3Params, (err, data) => {
    console.log("err",err)
    if (err) {
      console.log(err);
      return res.status(400).json(new ApiResponse(400,`there was some problem uploading chunk no ${index}`,{index}));
    }
    return res.json(new ApiResponse(200,`chunk no ${index}  is uploaded successfully`,{data}));
  });
})

export {startUpload,uploadChunk}