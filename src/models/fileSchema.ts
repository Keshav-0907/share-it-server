import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    metadata: {
        size: { type: Number, required: true },
        type: { type: String, required: true },
        lastModified: { type: Date, required: true },
    }
}, { timestamps: true });


const fileGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String },
    files: { type: [fileSchema], required: true },
    url: { type: String, required: true },
    code: { type: String, required: true },
    isProtected: { type: Boolean, default: false },
    password: { type: String },
    expiresAt: { type: Date },
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);
const FileGroup = mongoose.model("FileGroup", fileGroupSchema);


export { File, FileGroup };
