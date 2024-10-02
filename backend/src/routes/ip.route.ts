import { Router } from "express";
import { ifLimitReached, isFileSmallEnough } from "../controller/ip.route";
import { authMiddleware } from "../middlewares/auth.middleware";




const router = Router();


router.route("/limitreached").get(ifLimitReached)
router.route("/limitcheck").get(authMiddleware,isFileSmallEnough) 