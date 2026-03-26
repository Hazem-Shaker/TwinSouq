"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLogic = void 0;
// update-option.logic.ts
const input_1 = require("./input");
const option_model_1 = require("../option.model");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class UpdateLogic {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async update(optionId, data, language = "en") {
        // Validate input data (only provided fields)
        const validatedData = input_1.optionInputSchema.partial().parse(data);
        // Find the option to update
        const option = await option_model_1.Option.findById(optionId);
        if (!option) {
            throw new custom_errors_1.NotFoundError("optionNotFound"); // Use error key
        }
        const more = {};
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
        const updatedOption = await option_model_1.Option.findByIdAndUpdate(optionId, { $set: { ...validatedData, ...more } }, // Use $set to update only provided fields
        { new: true } // Return the updated document
        );
        return updatedOption;
    }
}
exports.UpdateLogic = UpdateLogic;
