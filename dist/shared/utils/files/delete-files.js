"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.deleteImages = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const file_model_1 = __importDefault(require("../../../modules/File/file.model"));
const custom_errors_1 = require("../../utils/custom-errors");
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
const deleteImages = async (imageIds, language = "en") => {
    try {
        const files = await file_model_1.default.find({
            _id: {
                $in: imageIds,
            },
        });
        const publicCloudinaryIds = files.map((file) => file.public_id);
        console.log(publicCloudinaryIds);
        const result = await cloudinary_1.v2.api.delete_resources(publicCloudinaryIds, {
            resource_type: "image", // Default is 'image', but you can specify 'video', 'raw', etc.
            type: "upload", // Default is 'upload', but you can specify 'private', 'authenticated', etc.
            invalidate: true, // Optional: Invalidate the CDN cache for these resources
        });
        console.log(result);
        await file_model_1.default.deleteMany({
            _id: {
                $in: imageIds,
            },
        });
    }
    catch (error) {
        throw new custom_errors_1.ServiceUnavailableError(language === "en"
            ? "Error with image service, please try again or contact support"
            : "حدث خطأ في خدمة الصور، يرجى المحاولة لاحقاً أو الإتصال بالدعم الفني");
    }
};
exports.deleteImages = deleteImages;
const deleteFiles = async (fileIds, language = "en") => {
    try {
        const files = await file_model_1.default.find({ _id: { $in: fileIds } });
        if (files.length === 0)
            return;
        // Extract public Cloudinary IDs and their resource types
        const cloudinaryDeletions = files.map((file) => ({
            public_id: file.public_id,
            resource_type: file.type === "video" ? "video" : file.type === "pdf" ? "raw" : "image",
        }));
        // Delete files from Cloudinary
        const deletePromises = cloudinaryDeletions.map(async ({ public_id, resource_type }) => {
            return cloudinary_1.v2.api.delete_resources([public_id], {
                resource_type,
                type: "upload",
                invalidate: true,
            });
        });
        await Promise.all(deletePromises);
        // Delete records from the database
        await file_model_1.default.deleteMany({ _id: { $in: fileIds } });
    }
    catch (error) {
        throw new custom_errors_1.ServiceUnavailableError(language === "en"
            ? "Error with file service, please try again or contact support"
            : "حدث خطأ في خدمة الملفات، يرجى المحاولة لاحقاً أو الإتصال بالدعم الفني");
    }
};
exports.deleteFiles = deleteFiles;
