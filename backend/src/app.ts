import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: "Too many requests from this IP, please try again after 15 minutes",});
const app = express();

//middleware declaration
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, //to allow cookies from the client
  })
);
app.disable("x-powered-by");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

//health check route
app.get(
    "/",
    (_: Request, res: Response) => {
      res.status(200).json(new ApiResponse(200,"is Healthy"));
    });

import mainRouter from "./routes/index.route";
import { ApiResponse } from "./utils/apiResponse";
// import { middleware } from "./middlewares/prometheus.middleware";
app.use("/api/v1", mainRouter);

export default app;