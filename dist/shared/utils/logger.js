"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerHelper = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Define log directory
const logDir = "logs";
// Custom format for logs
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? "\n" + stack : ""}`;
}));
// Console format with colors
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
}));
const logger = winston_1.default.createLogger({
    level: "info",
    format: customFormat,
    transports: [
        // Console transport
        new winston_1.default.transports.Console({
            format: consoleFormat,
        }),
        // Error log file
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "error.log"),
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Combined log file
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "combined.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Warning log file
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "warn.log"),
            level: "warn",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
    // Prevent logger from exiting on error
    exitOnError: false,
});
// Create helper methods for consistent logging
exports.loggerHelper = {
    error: (message, meta) => {
        logger.error(message, meta);
    },
    warn: (message, meta) => {
        logger.warn(message, meta);
    },
    info: (message, meta) => {
        logger.info(message, meta);
    },
    debug: (message, meta) => {
        logger.debug(message, meta);
    },
    // Method for logging HTTP requests
    httpLogger: (req, res, next) => {
        const start = Date.now();
        res.on("finish", () => {
            const duration = Date.now() - start;
            logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
        });
        next();
    },
};
// Handling uncaught exceptions
logger.exceptions.handle(new winston_1.default.transports.File({
    filename: path_1.default.join(logDir, "exceptions.log"),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
}));
// Handling unhandled promise rejections
process.on("unhandledRejection", (error) => {
    logger.error("Unhandled Promise Rejection:", error);
});
exports.default = exports.loggerHelper;
