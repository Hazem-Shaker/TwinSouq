"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLogic = void 0;
const category_model_1 = __importDefault(require("../category.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class DeleteLogic {
    async delete(slug) {
        const categories = await category_model_1.default.findOneAndDelete({
            $or: [
                { slug_ar: slug },
                { slug_en: slug }
            ]
        });
        if (!categories) {
            throw new custom_errors_1.NotFoundError("Category not found.");
        }
        return [categories];
    }
}
exports.DeleteLogic = DeleteLogic;
