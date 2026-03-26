"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReviewLogic = void 0;
const input_1 = require("./input");
const review_model_1 = __importDefault(require("../review.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class CreateReviewLogic {
    constructor(productService) {
        this.productService = productService;
    }
    async create(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const existingReview = await review_model_1.default.findOne({
            user: input.user,
            item: input.item,
        });
        if (existingReview) {
            throw new custom_errors_1.ConflictError("user_revied_item_before");
        }
        const review = await review_model_1.default.create({
            user: input.user,
            item: input.item,
            rating: input.rating,
            comment: input.comment ?? null,
            itemType: "product",
        });
        const updated = await this.productService.addReview(input.item, input.rating);
        if (!updated) {
            await review_model_1.default.findByIdAndDelete(review._id);
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        return review;
    }
}
exports.CreateReviewLogic = CreateReviewLogic;
