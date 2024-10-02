import { Router } from "express";
import multer  from "multer"
import { completeFileUpload, startUpload, uploadChunk } from "../controller/file.controller";
import { authMiddleware } from "../middlewares/auth.middleware";



const upload = multer()
const router = Router()

router.route("/startupload").post(authMiddleware,startUpload)
router.route('/uploadchunk').post(upload.single("file"),authMiddleware,uploadChunk)

router.route("/uploadcompleted").post(authMiddleware,completeFileUpload)
export default router