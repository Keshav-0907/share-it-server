import type { Response, Request } from "express";


export const createFileGroup = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ message: "File group created successfully" });
    } catch (error) {
        console.error("Error creating file group:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getFileGroup = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ message: "File group fetched successfully" });
    } catch (error) {
        console.error("Error fetching file group:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}