import { Router } from "express";
import { createUser, getUser, loginUser } from "../controllers/userControllers.js";
const userRouter = Router();
userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/get", getUser);
export default userRouter;
//# sourceMappingURL=userRoutes.js.map