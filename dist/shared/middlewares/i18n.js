"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nMiddleware = void 0;
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const path_1 = __importDefault(require("path"));
i18next_1.default
    .use(i18next_fs_backend_1.default) // Use the file system backend to load translation files
    .use(i18next_http_middleware_1.default.LanguageDetector) // Detect language from headers
    .init({
    backend: {
        loadPath: path_1.default.resolve(__dirname, "../../../locales/{{lng}}.json"), // Path to translation files
    },
    fallbackLng: "en", // Default language if none is detected
    preload: ["en", "ar"], // Preload supported languages
    detection: {
        order: ["header", "querystring", "cookie"], // Order to detect language
        caches: ["cookie"], // Cache user language in a cookie
    },
    debug: false, // Set to true to debug translations
});
exports.default = i18next_1.default;
exports.i18nMiddleware = i18next_http_middleware_1.default.handle(i18next_1.default);
