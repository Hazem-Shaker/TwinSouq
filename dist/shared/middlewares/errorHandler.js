"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_errors_1 = require("../utils/custom-errors");
const multer_1 = __importDefault(require("multer"));
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
                success: false,
                error: req.t("errors.file_size_limit_exceeded"),
                statusCode: 400,
            });
            return;
        }
        else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            res.status(400).json({
                success: false,
                error: req.t("errors.file_size_limit_exceeded"),
                statusCode: 400,
            });
            return;
        }
    }
    // If the error is a BaseError, use its status code and message
    if (err instanceof custom_errors_1.BaseError) {
        logger_1.default.error(err.message);
        res.status(err.statusCode).json({
            success: false,
            message: req.t(`errors.${err.message}`),
            statusCode: err.statusCode,
        });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        logger_1.default.error(err.message);
        let errorMsg;
        errorMsg = err.issues[0].message;
        res.status(422).json({
            success: false,
            message: req.t(`validation.${errorMsg}`),
            statusCode: 422,
        });
    }
    logger_1.default.error(err.message);
    res.status(500).json({
        success: false,
        message: "Something went wrong",
        statusCode: 500,
    });
};
exports.errorHandler = errorHandler;
