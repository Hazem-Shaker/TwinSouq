"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const settingSchema = new mongoose_1.Schema({
    appName: {
        ar: { type: String, required: true, default: "توين سوق" },
        en: { type: String, required: true, default: "TwinSouq" },
    },
    appDescription: {
        ar: {
            type: String,
            required: true,
            default: "الدكان هو وجهتك المثالية للتسوق عبر الإنترنت، حيث نقدم لك مجموعة واسعة من المنتجات المميزة التي تلبي جميع احتياجاتك",
        },
        en: {
            type: String,
            required: true,
            default: "الدكان هو وجهتك المثالية للتسوق عبر الإنترنت، حيث نقدم لك مجموعة واسعة من المنتجات المميزة التي تلبي جميع احتياجاتك",
        },
    },
    seo: {
        keywords: { type: [String], default: [] },
    },
    location: {
        ar: { type: String, default: "المملكة العربية السعودية" },
        en: { type: String, default: "The Kingdom of Saudi Arabia" },
    },
    email: { type: String, default: "contact@twinsouq.com" },
    phone: { type: String, default: "123456789" },
    copyRight: { type: String, default: "TwinSouq - 2025" },
    socialMedia: {
        instagram: { type: String, default: "instagram.com" },
        whatsapp: { type: String, default: "whatsapp.com" },
        facebook: { type: String, default: "facebook.com" },
        telegram: { type: String, default: "telegram.com" },
        twitter: { type: String, default: "x.com" },
        youtube: { type: String, default: "youtube.com" },
    },
    headerLogo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "File" },
    footerLogo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "File" },
}, {
    timestamps: true,
});
const Setting = mongoose_1.default.model("Setting", settingSchema);
exports.default = Setting;
