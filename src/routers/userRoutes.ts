import { Router } from "express";
import { createUser, getUser, getUserFileGroups, loginUser } from "../controllers/userControllers.js";
import { verifyAuth } from "../middlewares/verfyAuth.js";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/get", getUser);


userRouter.get("/get-user-fileGroups", verifyAuth, getUserFileGroups);

export default userRouter;