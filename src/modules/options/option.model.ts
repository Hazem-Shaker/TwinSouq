import { Schema, model } from "mongoose";
import { IValue, IOption } from "./types";

const valueSchema = new Schema<IValue>({
  id: { type: String, required: true }, // Unique ID for filtering
  name_ar: { type: String, required: true }, // Display name in Arabic
  name_en: { type: String, required: true }, // Display name in English
  metadata: { type: Schema.Types.Mixed }, // Additional metadata (e.g., hex code, image URL)
});

const optionSchema = new Schema<IOption>({
  name_ar: { type: String, required: true }, // Display name in Arabic
  name_en: { type: String, required: true }, // Display name in English
  id: { type: String, required: true },
  slug_ar: { type: String, required: true},
  slug_en: { type: String, required: true},
  values: [valueSchema], // Array of objects with unique IDs
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to the Category model
});

// optionSchema.index({ id: 1 });
// optionSchema.index({ slug_ar: 1 });
// optionSchema.index({ slug_en: 1 });

export const Option = model<IOption>("Option", optionSchema);
