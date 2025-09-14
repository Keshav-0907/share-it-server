import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";


const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.status(401).json({ message: "No authorization header provided" });
    }

    const token = authorization.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}   

export { verifyAuth };