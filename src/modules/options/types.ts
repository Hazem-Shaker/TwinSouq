import { Document, Types } from "mongoose";

export interface IValue extends Document {
  id: string; // Unique ID for filtering
  name_ar: string; // Display name in Arabic
  name_en: string; // Display name in English
  metadata?: Record<string, any>; // Additional metadata (e.g., hex code, image URL)
}

export interface IOption extends Document {
  name_ar: string; // Display name in Arabic
  name_en: string; // Display name in English
  values: IValue[]; // Array of objects with unique IDs
  category: Types.ObjectId; // Reference to the Category model
  id: string;
  slug_ar: string;
  slug_en: string;
}
