import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    totalDownloads: { type: Number, default: 0 },
    metadata: {
        size: { type: Number, required: true },
        mimetype: { type: String, required: true },
    }
}, { timestamps: true });


const fileGroupSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    files: { type: [mongoose.Schema.Types.ObjectId], ref: "File" },
    code: { type: String, required: true },
    isProtected: { type: Boolean, default: false },
    password: { type: String },
    expiresAfter: { type: Number, required: true },
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);
const FileGroup = mongoose.model("FileGroup", fileGroupSchema);

export { File, FileGroup };
