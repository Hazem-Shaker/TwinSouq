"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductLogic = void 0;
const product_model_1 = __importDefault(require("../../product.model"));
const variant_model_1 = __importDefault(require("../../product-variants/variant.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const files_1 = require("../../../../shared/utils/files");
class DeleteProductLogic {
    constructor() { }
    async remove(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const { id, provider } = input;
        const product = await product_model_1.default.findById(id);
        console.log(product);
        if (!product) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        if (product?.provider?.toString() !== provider.toString()) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        const variants = await variant_model_1.default.find({ product });
        let toDeleteImages = [...product.images];
        for (let variant of variants) {
            toDeleteImages = [...toDeleteImages, ...variant.images];
        }
        await product_model_1.default.findByIdAndDelete(product._id);
        await variant_model_1.default.deleteMany({ product: product._id });
        await (0, files_1.deleteImages)(toDeleteImages);
        return null;
    }
}
exports.DeleteProductLogic = DeleteProductLogic;
