"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = void 0;
const mongoose_1 = require("mongoose");
const valueSchema = new mongoose_1.Schema({
    id: { type: String, required: true }, // Unique ID for filtering
    name_ar: { type: String, required: true }, // Display name in Arabic
    name_en: { type: String, required: true }, // Display name in English
    metadata: { type: mongoose_1.Schema.Types.Mixed }, // Additional metadata (e.g., hex code, image URL)
});
const optionSchema = new mongoose_1.Schema({
    name_ar: { type: String, required: true }, // Display name in Arabic
    name_en: { type: String, required: true }, // Display name in English
    id: { type: String, required: true },
    slug_ar: { type: String, required: true },
    slug_en: { type: String, required: true },
    values: [valueSchema], // Array of objects with unique IDs
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to the Category model
});
// optionSchema.index({ id: 1 });
// optionSchema.index({ slug_ar: 1 });
// optionSchema.index({ slug_en: 1 });
exports.Option = (0, mongoose_1.model)("Option", optionSchema);
