import mongoose, { Schema, Model } from "mongoose";
import { ISetting } from "./types";

const settingSchema: Schema<ISetting> = new Schema<ISetting>(
  {
    appName: {
      ar: { type: String, required: true, default: "توين سوق" },
      en: { type: String, required: true, default: "TwinSouq" },
    },
    appDescription: {
      ar: {
        type: String,
        required: true,
        default:
          "الدكان هو وجهتك المثالية للتسوق عبر الإنترنت، حيث نقدم لك مجموعة واسعة من المنتجات المميزة التي تلبي جميع احتياجاتك",
      },
      en: {
        type: String,
        required: true,
        default:
          "الدكان هو وجهتك المثالية للتسوق عبر الإنترنت، حيث نقدم لك مجموعة واسعة من المنتجات المميزة التي تلبي جميع احتياجاتك",
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
    headerLogo: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    footerLogo: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  },
  {
    timestamps: true,
  }
);

const Setting: Model<ISetting> = mongoose.model<ISetting>(
  "Setting",
  settingSchema
);

export default Setting;
