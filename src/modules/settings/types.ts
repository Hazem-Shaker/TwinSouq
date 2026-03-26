import mongoose from "mongoose";

export interface ISetting extends mongoose.Document {
  appName: string;
  appDescription: string;
  seo: {
    keywords: string[];
  };
  location: string;
  email: string;
  phone: string;
  copyRight: string;
  socialMedia: {
    instagram: string;
    whatsapp: string;
    facebook: string;
    telegram: string;
    twitter: string;
    youtube: string;
  };
  headerLogo: mongoose.Schema.Types.ObjectId;
  footerLogo: mongoose.Schema.Types.ObjectId;
  heroVideo: mongoose.Schema.Types.ObjectId;
  appFavicon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ISettingResponseData = Omit<ISetting, "__v"> & { __v?: number };
