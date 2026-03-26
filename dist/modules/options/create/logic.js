"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOptionLogic = void 0;
// create-option.logic.ts
const input_1 = require("./input");
const option_model_1 = require("../option.model");
const slugify_1 = require("../../../shared/utils/slugify");
class CreateOptionLogic {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(data, language = "en") {
        // Validate input data
        data = input_1.optionInputSchema.parse(data);
        // Check for conflicts in Arabic name
        const slug_ar = (0, slugify_1.slugify)(data.name_ar);
        // let optionExist = await Option.findOne({ slug_ar });
        // if (optionExist) {
        //   throw new ConflictError("arabicOptionExists"); // Use error key
        // }
        // Check for conflicts in English name
        const slug_en = (0, slugify_1.slugify)(data.name_en);
        // optionExist = await Option.findOne({ slug_en });
        // if (optionExist) {
        //   throw new ConflictError("englishOptionExists"); // Use error key
        // }
        const category = await this.categoryService.getForOptions(data.category);
        // Check if any of the value IDs already exist in other options
        // const valueIds = data.values.map(value => value.id);
        // const existingValueId = await Option.findOne({ 'values.id': { $in: valueIds } }, { 'values.$': 1 });
        // if (existingValueId) {
        //   const duplicateValueId = existingValueId.values[0].id;
        //   throw new ConflictError(`valueIdExists:${duplicateValueId}`);
        // }
        // Create the option
        const option = await option_model_1.Option.create({
            ...data,
            slug_ar,
            slug_en,
            id: category.slug_en + "-" + slug_en,
        });
        return option;
    }
}
exports.CreateOptionLogic = CreateOptionLogic;
