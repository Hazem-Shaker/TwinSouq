import { inputSchema, Input } from "./input";
import Category from "../category.model";
import { config } from "../../../shared/config";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../../../shared/utils/custom-errors";
import { ICategoryResponseData } from "../types";
import { deleteImages, markFilesAsUsed } from "../../../shared/utils/files";
import { slugify } from "../../../shared/utils/slugify";
import mongoose from "mongoose";

export class UpdateLogic {
  async update(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const { id, data } = input;

    const slug_ar = slugify(data.name_ar);
    let categoryExist = await Category.findOne({ slug_ar });
    if (
      categoryExist &&
      categoryExist._id instanceof mongoose.Types.ObjectId &&
      categoryExist._id.toString() !== id.toString()
    ) {
      throw new ConflictError(
        language === "en"
          ? "Arabic Category name already exists"
          : "اسم القسم العربي موجود بالفعل"
      );
    }

    const slug_en = slugify(data.name_en);
    categoryExist = await Category.findOne({ slug_en });
    if (
      categoryExist &&
      categoryExist._id instanceof mongoose.Types.ObjectId &&
      categoryExist._id.toString() !== id.toString()
    ) {
      throw new ConflictError(
        language === "en"
          ? "English Category name already exists"
          : "اسم القسم الانجليزي موجود بالفعل"
      );
    }

    categoryExist = await Category.findById(id);
    if (!categoryExist) {
      throw new NotFoundError(
        language === "en"
          ? "Category with provided id not found"
          : "لا يوجد قسم بالرقم التعريفي المُعطى"
      );
    }
    await deleteImages([categoryExist.image as mongoose.Schema.Types.ObjectId]);

    await markFilesAsUsed(data.image.map((i) => i._id));

    if (categoryExist.parent) {
      if (!data.profitPercentage) {
        throw new BadRequestError("profit_percentage_required");
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { ...data, image: data.image[0]._id },
      { new: true }
    );

    return category;
  }
}
