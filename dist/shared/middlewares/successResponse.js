"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successMiddleware = void 0;
const successMiddleware = (req, res, next) => {
    res.sendSuccess = (message, data = null, statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            message,
            data,
            statusCode,
        });
    };
    next();
};
exports.successMiddleware = successMiddleware;
