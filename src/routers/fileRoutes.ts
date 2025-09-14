import { Router } from "express";
import multer from "multer";
import { createFileGroup, getFileGroup, downloadFileGroup, downloadFile } from "../controllers/fileControllers.js";

const fileRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

fileRouter.post("/create", upload.array('files'), createFileGroup);
fileRouter.post("/get/:code", getFileGroup);
fileRouter.post("/download", downloadFileGroup);
fileRouter.get("/download/:fileId", downloadFile);

export default fileRouter;