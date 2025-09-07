import mongoose from "mongoose";
export const connectToDb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not set");
        }
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to MongoDB");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
};
//# sourceMappingURL=connectToDb.js.map