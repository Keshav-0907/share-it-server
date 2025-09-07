import User from "../models/userSchema.js";
import type { Response, Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, subscription = "free" } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            subscription
        });

        user.save();


        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);

        return res.status(201).json({
            message: "User created successfully",
            token
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            subscription: user.subscription
        };

        return res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        
        if (!authorization) {
            return res.status(401).json({ message: "No authorization header provided" });
        }
        
        const token = authorization.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User fetched successfully", user: user });
    } catch (error) {
        console.error("Error getting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}