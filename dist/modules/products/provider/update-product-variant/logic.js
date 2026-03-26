"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductVariantLogic = void 0;
const product_model_1 = __importDefault(require("../../product.model"));
const variant_model_1 = __importDefault(require("../../product-variants/variant.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const files_1 = require("../../../../shared/utils/files");
class UpdateProductVariantLogic {
    constructor() { }
    async update(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const { variantId, provider, data } = input;
        const productVariant = await variant_model_1.default.findById(variantId);
        if (!productVariant) {
            throw new custom_errors_1.NotFoundError("variant_not_found");
        }
        const product = await product_model_1.default.findById(productVariant.product);
        if (!product) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        if (product.provider.toString() !== provider.toString()) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        if (data.salePrice && data.price && data.salePrice > data.price) {
            throw new custom_errors_1.ValidationError("sale_price_higher_than_price");
        }
        const updatedProductVariant = await variant_model_1.default.findByIdAndUpdate(variantId, data, { new: true });
        const newImages = data.images?.map((i) => i._id) || [];
        await (0, files_1.markFilesAsUsed)(newImages);
        if (productVariant.images.length)
            await (0, files_1.deleteImages)(productVariant.images);
        return updatedProductVariant;
    }
}
exports.UpdateProductVariantLogic = UpdateProductVariantLogic;
