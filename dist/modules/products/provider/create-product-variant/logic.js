"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductVariantLogic = void 0;
const product_model_1 = __importDefault(require("../../product.model"));
const variant_model_1 = __importDefault(require("../../product-variants/variant.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const files_1 = require("../../../../shared/utils/files");
const variant_service_1 = require("../../product-variants/variant.service");
class CreateProductVariantLogic {
    constructor(optionService) {
        this.optionService = optionService;
    }
    async create(input, provider, language = "en") {
        input = input_1.inputSchema.parse(input);
        const product = await product_model_1.default.findById(input.product);
        if (!product) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        if (product.provider.toString() !== provider) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        const options = await this.optionService.listByCategoryId(product.category, language);
        if (input.salePrice && input.price && input.salePrice > input.price) {
            throw new custom_errors_1.ValidationError("sale_price_higher_than_price");
        }
        if (input.options.length !== options.length) {
            throw new custom_errors_1.ValidationError("product_options_not_complete");
        }
        input.options.forEach((option) => {
            const existingOption = options.find((value) => option.key === value.id);
            if (!existingOption) {
                throw new custom_errors_1.ValidationError("wrong_option_key");
            }
            const existingValue = existingOption.values.find((value) => option.value === value.id);
            if (!existingValue) {
                throw new custom_errors_1.ValidationError("wrong_option_value");
            }
        });
        const variantExist = await variant_model_1.default.findOne({
            product: input.product, // NEW
            optionsString: (0, variant_service_1.getOptionsString)(input.options),
        });
        if (variantExist) {
            throw new custom_errors_1.ConflictError("varaint_exist");
        }
        // mark images as used
        if (input.images)
            await (0, files_1.markFilesAsUsed)(input.images.map((i) => i._id));
        // create variant
        const variant = await variant_model_1.default.create({
            ...input,
            optionsString: (0, variant_service_1.getOptionsString)(input.options),
        });
        return variant;
    }
}
exports.CreateProductVariantLogic = CreateProductVariantLogic;
