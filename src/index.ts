import "reflect-metadata";

import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";

import { authRoute } from "./routes";

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));

// Define Routes
app.use("/api/auth", authRoute);

app.get("/", (_req: Request, res: Response) => {
  return res
    .status(200)
    .json({ data: null, message: "Server up and running 🚀🚀", success: true });
});

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    data: null,
    message: "Server is healthy and running smoothly 🏃🏾🏃🏾",
    success: true,
  });
});

// 404 Route
app.all("*", (_req: Request, res: Response) => {
  return res.status(404).json({
    data: "NOT_FOUND_ERROR",
    message: "Route does not exist, check provided endpoint and try again",
    success: false,
  });
});

export default app;
