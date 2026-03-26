// update-option.logic.ts
import { optionInputSchema, OptionInput } from "./input";
import { Option } from "../option.model";
import {
  ConflictError,
  NotFoundError,
} from "../../../shared/utils/custom-errors";
import { slugify } from "../../../shared/utils/slugify";
import { Schema } from "mongoose";
import { CategoryService } from "../../categories/category.service";
import mongoose from "mongoose";
export class UpdateLogic {
  constructor(private categoryService: CategoryService) {}
  async update(
    optionId: string,
    data: Partial<OptionInput>,
    language: string = "en"
  ) {
    // Validate input data (only provided fields)
    const validatedData = optionInputSchema.partial().parse(data);

    // Find the option to update
    const option = await Option.findById(optionId);
    if (!option) {
      throw new NotFoundError("optionNotFound"); // Use error key
    }
    const more: any = {};
    // Check for conflicts in Arabic name (if provided)
    // if (validatedData.name_ar) {
    //   const slug_ar = slugify(validatedData.name_ar);
    //   const optionExist = await Option.findOne({ slug_ar });
    //   if (
    //     optionExist &&
    //     optionExist._id instanceof Schema.Types.ObjectId &&
    //     optionExist._id.toString() !== optionId
    //   ) {
    //     throw new ConflictError("arabicOptionExists"); // Use error key
    //   }
    //   more.slug_ar = slug_ar; // Update slug if name_ar is provided
    // }

    // Check for conflicts in English name (if provided)
    // if (validatedData.name_en) {
    //   const slug_en = slugify(validatedData.name_en);
    //   const optionExist = await Option.findOne({ slug_en });
    //   if (
    //     optionExist &&
    //     optionExist._id instanceof Schema.Types.ObjectId &&
    //     optionExist._id.toString() !== optionId
    //   ) {
    //     throw new ConflictError("englishOptionExists"); // Use error key
    //   }
    //   more.slug_en = slug_en; // Update slug if name_en is provided
    //   const category = await this.categoryService.getForOptions(
    //     option.category as any as mongoose.Schema.Types.ObjectId
    //   );
    //   more.id = category.slug_en + "-" + slug_en;
    // }

    // Update the option with only provided fields
    const updatedOption = await Option.findByIdAndUpdate(
      optionId,
      { $set: { ...validatedData, ...more } }, // Use $set to update only provided fields
      { new: true } // Return the updated document
    );

    return updatedOption;
  }
}
