import { Router } from "express";
import { googleSignIn } from "../controllers/authRoutes.js";
const authRouter = Router();
authRouter.post("/google", googleSignIn);
export default authRouter;
//# sourceMappingURL=authRoutes.js.map