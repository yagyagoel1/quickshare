import { Router } from "express";
import fileUploadRouter from "./file.route"


const router = Router()


router.use("/file",fileUploadRouter)


export default router