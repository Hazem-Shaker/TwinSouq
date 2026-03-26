import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  parent?: mongoose.Schema.Types.ObjectId | null; // For hierarchical structure
  image?: mongoose.Schema.Types.ObjectId; // URL of category image
  profitPercentage: number;
  slug_ar: string; // SEO-friendly URL identifier
  slug_en: string; // SEO-friendly URL identifier
  isActive: boolean; // Status of the category
  createdAt: Date;
  updatedAt: Date;
}

export type ICategoryResponseData = Omit<ICategory, "__v"> & { __v?: number };
