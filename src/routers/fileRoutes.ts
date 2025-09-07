import { Router } from "express";
import { createFileGroup, getFileGroup } from "../controllers/fileControllers.js";

const fileRouter = Router();

fileRouter.post("/create", createFileGroup);
fileRouter.get("/get", getFileGroup);

export default fileRouter;