import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routers/userRoutes.js";
import { connectToDb } from "./utils/connectToDb.js";
import fileRouter from "./routers/fileRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Health check" });
});

app.use("/user", userRouter);
app.use("/file-group", fileRouter);

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();