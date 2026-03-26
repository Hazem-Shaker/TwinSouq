"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../../config");
// Define the path to the email templates
const viewPath = path_1.default.resolve(__dirname, "../../../../email-templates");
// Create the transporter with TypeScript typing
const transporter = nodemailer_1.default.createTransport({
    host: config_1.config.email.host,
    port: config_1.config.email.port,
    secure: config_1.config.email.secure === "true",
    auth: {
        user: config_1.config.email.user,
        pass: config_1.config.email.pass,
    },
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
    },
});
// Configure Handlebars for email templates
transporter.use("compile", (0, nodemailer_express_handlebars_1.default)({
    viewEngine: {
        extname: ".handlebars",
        layoutsDir: viewPath,
        defaultLayout: "",
    },
    viewPath,
    extName: ".handlebars",
}));
exports.default = transporter;
