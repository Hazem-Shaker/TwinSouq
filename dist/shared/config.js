"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    database: {
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
    },
    jwt: {
        secret: process.env.JWT_SECRET || "your-secret-key",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    bcrypt: {
        saltRounds: 10,
    },
    app: { url: process.env.API_URL || "http://localhost:3000" },
    email: {
        host: process.env.SMTP_HOST || "smtp.mailtrap.io",
        port: parseInt(process.env.SMTP_PORT || "2525", 10),
        user: process.env.SMTP_USER || "your-email-user",
        pass: process.env.SMTP_PASS || "your-email-password",
        secure: process.env.SMTP_SECURE || "false",
    },
    upload: {
        path: process.env.UPLOAD_PATH || "./uploads",
    },
    pusher: {
        instanceId: process.env.PUSHER_INSTANCE_ID, // Add to your .env
        secretKey: process.env.PUSHER_SECRET_KEY,
    },
};
