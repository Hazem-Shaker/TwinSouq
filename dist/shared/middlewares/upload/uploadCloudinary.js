"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideosMiddleware = exports.processPdfsMiddleware = exports.processUpload = exports.productUpload = exports.handleUploadAny = exports.processImagesMiddleware = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const dotenv_1 = __importDefault(require("dotenv"));
const heic_convert_1 = __importDefault(require("heic-convert"));
const file_model_1 = __importDefault(require("../../../modules/File/file.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const custom_errors_1 = require("../../utils/custom-errors");
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
// Configure Multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for videos & PDFs
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/") &&
            !file.mimetype.startsWith("video/") &&
            file.mimetype !== "application/pdf") {
            return cb(new custom_errors_1.InvalidFileTypeError("Only images, videos, and PDFs are allowed!"));
        }
        cb(null, true);
    },
});
exports.upload = upload;
// Helper function to convert HEIC to JPEG
const convertHEIC = async (buffer) => {
    try {
        const arrayBuffer = await (0, heic_convert_1.default)({
            buffer,
            format: "JPEG",
        });
        return Buffer.from(arrayBuffer);
    }
    catch (error) {
        throw new custom_errors_1.InvalidFileTypeError("Failed to convert HEIC image to JPEG format.");
    }
};
// Helper function to compress and correct image orientation
const compressImage = async (buffer, mimetype) => {
    try {
        const imageProcessor = (0, sharp_1.default)(buffer).rotate(); // Correct orientation
        switch (mimetype) {
            case "image/jpeg":
            case "image/jpg":
                return await imageProcessor.jpeg({ quality: 80 }).toBuffer();
            case "image/png":
                return await imageProcessor
                    .png({ quality: 80, compressionLevel: 9 })
                    .toBuffer();
            case "image/webp":
                return await imageProcessor.webp({ quality: 80 }).toBuffer();
            case "image/svg+xml":
                return buffer;
            default:
                throw new custom_errors_1.InvalidFileTypeError(`Unsupported image format: ${mimetype}`);
        }
    }
    catch (error) {
        throw new custom_errors_1.InternalServerError(`Image compression failed`);
    }
};
// Helper function to upload an image to Cloudinary
const uploadImageToCloudinary = async (buffer, ownerId) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "uploads" }, (error, result) => {
                if (error)
                    return reject(new Error("Cloudinary upload failed."));
                resolve({
                    asset_id: result?.asset_id ?? "",
                    public_id: result?.public_id ?? "",
                    url: result?.url ?? "",
                    type: "image",
                    owner: new mongoose_1.default.Types.ObjectId(ownerId),
                });
            });
            streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
        });
    }
    catch (error) {
        throw new custom_errors_1.InternalServerError(`Failed to upload image to Cloudinary`);
    }
};
const uploadVideoToCloudinary = async (buffer, ownerId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "uploads/videos", resource_type: "video" }, (error, result) => {
            if (error)
                return reject(new Error("Cloudinary video upload failed."));
            resolve({
                asset_id: result?.asset_id ?? "",
                public_id: result?.public_id ?? "",
                url: result?.secure_url ?? "",
                type: "video",
                owner: new mongoose_1.default.Types.ObjectId(ownerId),
            });
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
// Upload PDF to Cloudinary
const uploadPdfToCloudinary = async (buffer, ownerId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "uploads/pdfs", resource_type: "raw" }, (error, result) => {
            if (error)
                return reject(new Error("Cloudinary PDF upload failed."));
            resolve({
                asset_id: result?.asset_id ?? "",
                public_id: result?.public_id ?? "",
                url: result?.secure_url ?? "",
                type: "pdf",
                owner: new mongoose_1.default.Types.ObjectId(ownerId),
            });
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
// Main middleware to process images
const processImagesMiddleware = (fields) => async (req, res, next) => {
    try {
        if (!req.files || typeof req.files !== "object") {
            for (let key of fields) {
                req.body[key] = [];
            }
            return next();
        }
        const files = req.files;
        for (let field of fields) {
            const uploadPromises = files[field]?.map(async (file) => {
                let processedBuffer;
                // Convert HEIC images if needed
                if (file.mimetype === "image/heic" ||
                    file.mimetype === "image/heif") {
                    processedBuffer = await convertHEIC(file.buffer);
                }
                else {
                    processedBuffer = await compressImage(file.buffer, file.mimetype);
                }
                // Upload to Cloudinary
                return await uploadImageToCloudinary(processedBuffer, req.user.id);
            }) || [];
            // Wait for all uploads and save results to the database
            const uploadedFiles = await Promise.all(uploadPromises);
            req.body[field] = await file_model_1.default.insertMany(uploadedFiles);
        }
        next();
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};
exports.processImagesMiddleware = processImagesMiddleware;
const processVideosMiddleware = (fields) => async (req, res, next) => {
    try {
        if (!req.files || typeof req.files !== "object") {
            for (let key of fields)
                req.body[key] = [];
            return next();
        }
        const files = req.files;
        for (let field of fields) {
            const uploadPromises = files[field]?.map(async (file) => {
                return await uploadVideoToCloudinary(file.buffer, req.user.id); // Direct upload
            }) || [];
            req.body[field] = await file_model_1.default.insertMany(await Promise.all(uploadPromises));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.processVideosMiddleware = processVideosMiddleware;
const processPdfsMiddleware = (fields) => async (req, res, next) => {
    try {
        if (!req.files || typeof req.files !== "object") {
            for (let key of fields)
                req.body[key] = [];
            return next();
        }
        const files = req.files;
        for (let field of fields) {
            const uploadPromises = files[field]?.map(async (file) => {
                return await uploadPdfToCloudinary(file.buffer, req.user.id); // Direct upload
            }) || [];
            req.body[field] = await file_model_1.default.insertMany(await Promise.all(uploadPromises));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.processPdfsMiddleware = processPdfsMiddleware;
const processUpload = (fields) => async (req, res, next) => {
    try {
        if (!req.files || typeof req.files !== "object") {
            for (let key of fields)
                req.body[key] = [];
            return next();
        }
        const files = req.files;
        for (let field of fields) {
            const uploadPromises = files[field]?.map(async (file) => {
                let processedBuffer = file.buffer;
                let uploadFunction;
                // Handle different file types
                if (file.mimetype.startsWith("image/")) {
                    if (file.mimetype === "image/heic" ||
                        file.mimetype === "image/heif") {
                        processedBuffer = await convertHEIC(file.buffer);
                    }
                    else {
                        processedBuffer = await compressImage(file.buffer, file.mimetype);
                    }
                    uploadFunction = uploadImageToCloudinary;
                }
                else if (file.mimetype.startsWith("video/")) {
                    uploadFunction = uploadVideoToCloudinary;
                }
                else if (file.mimetype === "application/pdf") {
                    uploadFunction = uploadPdfToCloudinary;
                }
                else {
                    throw new custom_errors_1.InvalidFileTypeError(`Unsupported file format: ${file.mimetype}`);
                }
                // Upload the file
                return await uploadFunction(processedBuffer, req.user.id);
            }) || [];
            req.body[field] = await file_model_1.default.insertMany(await Promise.all(uploadPromises));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.processUpload = processUpload;
const handleUploadAny = async (req, res, next) => {
    try {
        if (!req.files || typeof req.files !== "object") {
            return next();
        }
        const files = req.files;
        const body = req.body;
        // Parse dynamic installmentsOptions structure
        const installmentsOptions = [];
        // Group text fields into the installmentsOptions array
        Object.keys(body)
            .filter((key) => key.startsWith("installmentsOptions"))
            .forEach((key) => {
            const match = key.match(/installmentsOptions\[(\d+)\]\[(\w+)\]/);
            if (match) {
                const [_, index, field] = match;
                if (!installmentsOptions[+index])
                    installmentsOptions[+index] = {};
                installmentsOptions[+index][field] = body[key];
            }
        });
        // Process files and upload to Cloudinary
        await Promise.all(Object.entries(files).map(async ([fieldname, fileArray]) => {
            for (const file of fileArray) {
                const match = fieldname.match(/installmentsOptions\[(\d+)\]\[image\]/);
                if (match) {
                    const index = +match[1];
                    // Compress or convert HEIC files
                    let processedBuffer;
                    if (file.mimetype === "image/heic" ||
                        file.mimetype === "image/heif") {
                        processedBuffer = await convertHEIC(file.buffer);
                    }
                    else {
                        processedBuffer = await compressImage(file.buffer, file.mimetype);
                    }
                    // Upload to Cloudinary
                    const uploadedImage = await uploadImageToCloudinary(processedBuffer, req.user.id);
                    // Attach uploaded image info to installmentsOptions
                    if (!installmentsOptions[index])
                        installmentsOptions[index] = {};
                    installmentsOptions[index].image = uploadedImage;
                }
            }
        }));
        // Remove empty slots in the array
        req.body.installmentsOptions = installmentsOptions.filter((option) => option !== undefined);
        next();
    }
    catch (error) {
        next(error); // Pass errors to error-handling middleware
    }
};
exports.handleUploadAny = handleUploadAny;
const productUpload = async (req, res, next) => {
    try {
        if (!req.files || typeof req.files !== "object") {
            return next();
        }
        const files = req.files;
        const images = files.filter((file) => file.fieldname === "images");
        const imagesUploadPromises = images.map(async (file) => {
            let processedBuffer;
            // Convert HEIC images if needed
            if (file.mimetype === "image/heic" || file.mimetype === "image/heif") {
                processedBuffer = await convertHEIC(file.buffer);
            }
            else {
                processedBuffer = await compressImage(file.buffer, file.mimetype);
            }
            // Upload to Cloudinary
            return await uploadImageToCloudinary(processedBuffer, req.user.id);
        });
        // Wait for all uploads and save results to the database
        const uploadedImages = await Promise.all(imagesUploadPromises);
        req.body.images = await file_model_1.default.insertMany(uploadedImages);
        if (!req.body.installmentOptions) {
            return next();
        }
        for (let i = 0; i < req.body.installmentOptions.length; i++) {
            const image = files.find((file) => file.fieldname === `installmentOptions[${i}][contract]`);
            if (!image) {
                continue;
            }
            let processedBuffer;
            if (image.mimetype === "image/heic" || image.mimetype === "image/heif") {
                processedBuffer = await convertHEIC(image.buffer);
            }
            else {
                processedBuffer = await compressImage(image.buffer, image.mimetype);
            }
            const uploadedImage = await uploadImageToCloudinary(processedBuffer, req.user.id);
            req.body.installmentOptions[i].contract = await file_model_1.default.insertMany(uploadedImage);
        }
        next();
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};
exports.productUpload = productUpload;
