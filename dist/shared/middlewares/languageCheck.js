"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageMiddleware = void 0;
const languageMiddleware = (req, res, next) => {
    let language = req.headers["Accept-Language"] || "en";
    if (language !== "en" && language !== "ar")
        language = "en";
    req.language = language;
    next();
};
exports.languageMiddleware = languageMiddleware;
