import cron from "node-cron"
import { ipManagement } from "./IPmanagement"
import AWS from "aws-sdk"
const s3 = new AWS.S3({
    region : process.env.AWS_REGION,
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
})

const bucketName = process.env.AWS_BUCKET_NAME

async function deleteOldFiles(){
    try {
        // Get the current date and subtract 3 days
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        if(!bucketName){
            throw new Error("bucket name not found")
        }
        // List objects in the S3 bucket
        const listParams = {
          Bucket: bucketName
        };
        
        const data = await s3.listObjectsV2(listParams).promise();
    
        if (data.Contents) {
          for (const file of data.Contents) {
            if (file.LastModified && new Date(file.LastModified) < threeDaysAgo) {
              // Delete the file if it's older than 3 days
              const deleteParams = {
                Bucket: bucketName,
                Key: file.Key as string,
              };
              await s3.deleteObject(deleteParams).promise();
              console.log(`Deleted: ${file.Key}`);
            }
          }
        }
      } catch (error) {
        console.error("Error while deleting old files:", error);
      }
}
cron.schedule("0 0 * * *",()=>{
    console.log("Cron job running")
    ipManagement._clearIps()
    deleteOldFiles()
})