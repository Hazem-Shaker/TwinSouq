import mongoose, { Model, Schema } from "mongoose";
import { slugify } from "../../shared/utils/slugify";
import { ICategory } from "./types";

const CategorySchema: Schema = new Schema<ICategory>(
  {
    name_ar: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
      required: true,
    },
    description_ar: {
      type: String,
      default: "",
    },
    description_en: {
      type: String,
      default: "",
    },
    profitPercentage: {
      type: Number,
      default: 0,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    slug_ar: {
      type: String,
      unique: true,
    },
    slug_en: {
      type: String,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware to auto-generate a slug before saving
CategorySchema.pre<ICategory>("save", function (next) {
  if (this.isModified("name_ar")) {
    this.slug_ar = slugify(this.name_ar);
  }
  if (this.isModified("name_en")) {
    this.slug_en = slugify(this.name_en);
  }
  next();
});

CategorySchema.index({ slug_en: 1 });
CategorySchema.index({ slug_ar: 1 });

// Mongoose Model
const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  CategorySchema
);

export default Category;
