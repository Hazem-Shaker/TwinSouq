"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLogic = void 0;
const input_1 = require("./input");
const category_model_1 = __importDefault(require("../category.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const files_1 = require("../../../shared/utils/files");
const slugify_1 = require("../../../shared/utils/slugify");
const mongoose_1 = __importDefault(require("mongoose"));
class UpdateLogic {
    async update(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const { id, data } = input;
        const slug_ar = (0, slugify_1.slugify)(data.name_ar);
        let categoryExist = await category_model_1.default.findOne({ slug_ar });
        if (categoryExist &&
            categoryExist._id instanceof mongoose_1.default.Types.ObjectId &&
            categoryExist._id.toString() !== id.toString()) {
            throw new custom_errors_1.ConflictError(language === "en"
                ? "Arabic Category name already exists"
                : "اسم القسم العربي موجود بالفعل");
        }
        const slug_en = (0, slugify_1.slugify)(data.name_en);
        categoryExist = await category_model_1.default.findOne({ slug_en });
        if (categoryExist &&
            categoryExist._id instanceof mongoose_1.default.Types.ObjectId &&
            categoryExist._id.toString() !== id.toString()) {
            throw new custom_errors_1.ConflictError(language === "en"
                ? "English Category name already exists"
                : "اسم القسم الانجليزي موجود بالفعل");
        }
        categoryExist = await category_model_1.default.findById(id);
        if (!categoryExist) {
            throw new custom_errors_1.NotFoundError(language === "en"
                ? "Category with provided id not found"
                : "لا يوجد قسم بالرقم التعريفي المُعطى");
        }
        await (0, files_1.deleteImages)([categoryExist.image]);
        await (0, files_1.markFilesAsUsed)(data.image.map((i) => i._id));
        if (categoryExist.parent) {
            if (!data.profitPercentage) {
                throw new custom_errors_1.BadRequestError("profit_percentage_required");
            }
        }
        const category = await category_model_1.default.findOneAndUpdate({ _id: id }, { ...data, image: data.image[0]._id }, { new: true });
        return category;
    }
}
exports.UpdateLogic = UpdateLogic;
