"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogic = void 0;
const input_1 = require("./input");
const category_model_1 = __importDefault(require("../category.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const slugify_1 = require("../../../shared/utils/slugify");
const files_1 = require("../../../shared/utils/files");
class CreateLogic {
    async create(data, language = "en") {
        data = input_1.inputSchema.parse(data);
        const slug_ar = (0, slugify_1.slugify)(data.name_ar);
        let categoryExist = await category_model_1.default.findOne({ slug_ar });
        if (categoryExist) {
            throw new custom_errors_1.ConflictError("arabicCategoryExists"); // Use error key
        }
        const slug_en = (0, slugify_1.slugify)(data.name_en);
        categoryExist = await category_model_1.default.findOne({ slug_en });
        if (categoryExist) {
            throw new custom_errors_1.ConflictError("englishCategoryExists"); // Use error key
        }
        if (data.parent) {
            if (!data.profitPercentage) {
                throw new custom_errors_1.BadRequestError("profit_percentage_required");
            }
        }
        const category = await category_model_1.default.create({
            ...data,
            image: data.image[0]._id,
        });
        await (0, files_1.markFilesAsUsed)(data.image.map((i) => i._id));
        return category;
    }
}
exports.CreateLogic = CreateLogic;
