import { FileGroup } from "../models/fileSchema.js";

export const generateUniqueCode = async () => {
    let code;
    let attempts = 0;
    const maxAttempts = 10;

    do {
        code = Math.floor(1000 + Math.random() * 9000).toString()
        const existingFileGroup = await FileGroup.findOne({ code });
        if (!existingFileGroup) {
            return code;
        }
        attempts++;
    } while (attempts < maxAttempts);

    throw new Error("Unable to generate unique code after maximum attempts");
}