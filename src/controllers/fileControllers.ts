import type { Response, Request } from "express";
import { File, FileGroup } from "../models/fileSchema.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import r2 from "../utils/r2.js";
import { generateUniqueCode } from "../utils/helperFunctions.js";


export const createFileGroup = async (req: Request, res: Response) => {
    try {
        const uploadedFiles = req.files as Express.Multer.File[];
        const { userId, expiresAfter } = req.body;

        if (!expiresAfter) {
            return res.status(400).json({ success: false, message: "Expiration time is required" });
        }

        const expiresAfterInHours = Number(expiresAfter);

        console.log('expiresAfterInHours', expiresAfterInHours);
        
        if (isNaN(expiresAfterInHours) || expiresAfterInHours <= 0) {
            return res.status(400).json({ success: false, message: "Expiration time must be a valid positive number" });
        }

        if (expiresAfterInHours > 3 && !userId) {
            return res.status(400).json({ success: false, message: "You need to be logged in to set this expiration time" });
        }

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ success: false, message: "No files provided" });
        }

        const savedFiles = [];

        for (const file of uploadedFiles) {
            const command = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET as string,
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await r2.send(command);

            const newFile = await File.create({
                filename: file.originalname,
                url: `${process.env.R2_PUBLIC_URL}/${file.originalname}`,
                metadata: {
                    mimetype: file.mimetype,
                    size: file.size,
                },
            });

            savedFiles.push(newFile);
        }

        const groupCode = await generateUniqueCode();
        const fileGroup = await FileGroup.create({
            files: savedFiles.map((file) => file._id),
            code: groupCode,
            isProtected: false,
            user: userId ? userId : null,
            expiresAfter: expiresAfterInHours
        });

        return res.status(200).json({ success: true, message: "File group created successfully", fileGroup });
    } catch (error) {
        console.error("Error creating file group:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getFileGroup = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const fileGroup = await FileGroup.findOne({ code }).populate("files").select("expiresAfter createdAt");
        if (!fileGroup) {
            return res.status(404).json({ success: false, message: "File group not found" });
        }

        const timeLeft = fileGroup.expiresAfter - (Date.now() - fileGroup.createdAt.getTime()) / (1000 * 60 * 60);
        return res.status(200).json({ success: true, message: "File group fetched successfully", fileGroup: fileGroup.files, expiresAfter: fileGroup.expiresAfter, timeLeft: timeLeft });
    } catch (error) {
        console.error("Error fetching file group:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const downloadFileGroup = async (req: Request, res: Response) => {
    try {
        const { code, files } = req.body;

        if (!code || !files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ success: false, message: "Code and files array are required" });
        }

        const fileGroup = await FileGroup.findOne({ code });
        if (!fileGroup) {
            return res.status(404).json({ success: false, message: "File group not found" });
        }

        const fileRecords = await File.find({ _id: { $in: files } });
        if (fileRecords.length === 0) {
            return res.status(404).json({ success: false, message: "No files found" });
        }

        const fileGroupFileIds = fileGroup.files.map(id => id.toString());
        const validFiles = fileRecords.filter(file =>
            fileGroupFileIds.includes(file._id.toString())
        );

        if (validFiles.length === 0) {
            return res.status(403).json({ success: false, message: "Files do not belong to this file group" });
        }

        const fileLinks = validFiles.map(file => ({
            id: file._id,
            filename: file.filename,
            url: `/api/files/download/${file._id}`,
            metadata: file.metadata
        }));

        return res.status(200).json({
            success: true,
            message: "File links retrieved successfully",
            files: fileLinks
        });

    }
    catch (error) {
        console.error("Error downloading file group:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const downloadFile = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;

        if (!fileId) {
            return res.status(400).json({ success: false, message: "File ID is required" });
        }

        const fileRecord = await File.findById(fileId);
        if (!fileRecord) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET as string,
            Key: fileRecord.filename,
        });

        const response = await r2.send(command);

        if (!response.Body) {
            return res.status(404).json({ success: false, message: "File content not found" });
        }

        res.set({
            'Content-Type': fileRecord.metadata?.mimetype || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${fileRecord.filename}"`,
            'Content-Length': fileRecord.metadata?.size?.toString() || '',
        });

        const stream = response.Body as any;
        stream.pipe(res);

        fileRecord.totalDownloads++;
        await fileRecord.save();

        return res.status(200).json({ success: true, message: "File downloaded successfully" });

    } catch (error) {
        console.error("Error downloading file:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}