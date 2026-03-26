"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreaetProductLogic = void 0;
const product_model_1 = __importDefault(require("../../product.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const files_1 = require("../../../../shared/utils/files");
class CreaetProductLogic {
    constructor(optionService) {
        this.optionService = optionService;
    }
    async create(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        // validate options
        // const options = await this.optionService.listByCategoryId(
        //   input.category,
        //   language
        // );
        // if (input.options.length !== options.length) {
        //   throw new ValidationError("product_options_not_complete");
        // }
        // input.options.forEach((option) => {
        //   const existingOption = options.find((value) => option.key === value.id);
        //   if (!existingOption) {
        //     throw new ValidationError("wrong_option_key");
        //   }
        //   for (let val of option.values) {
        //     const existingValue = existingOption.values.find(
        //       (value: any) => val === value.id
        //     );
        //     if (!existingValue) {
        //       throw new ValidationError("wrong_option_value");
        //     }
        //   }
        // });
        if (input.salePrice && input.salePrice > input.price) {
            throw new custom_errors_1.ValidationError("sale_price_higher_than_price");
        }
        if (input.paymentChoices === "installment" &&
            (!input.installmentOptions || !input.installmentOptions.length)) {
            throw new custom_errors_1.ValidationError("installment_options_missing");
        }
        if (input.paymentChoices === "both" &&
            (!input.installmentOptions || !input.installmentOptions.length)) {
            throw new custom_errors_1.ValidationError("installment_options_missing");
        }
        if (input.paymentChoices === "cash" &&
            input.installmentOptions &&
            input.installmentOptions.length) {
            throw new custom_errors_1.ValidationError("installment_options_not_allowed");
        }
        const contracts = input.installmentOptions
            ? input.installmentOptions.map((i) => i.contract)
            : [];
        // mark images as used
        await (0, files_1.markFilesAsUsed)([...input.images, ...contracts]);
        // create the product
        const product = await product_model_1.default.create(input);
        return product;
    }
}
exports.CreaetProductLogic = CreaetProductLogic;
