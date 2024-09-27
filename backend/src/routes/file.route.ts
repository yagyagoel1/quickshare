import { Router } from "express";
import multer  from "multer"
import { startUpload, uploadChunk } from "../controller/file.controller";



const upload = multer()
const router = Router()


router.route("/startupload").post(startUpload)

router.route('/uploadChunk').post(upload.single("file"),uploadChunk)
export default router