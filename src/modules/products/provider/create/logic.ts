import Product from "../../product.model";
import { inputSchema, Input } from "./input";
import { OptionService } from "../../../options/option.service";
import { ValidationError } from "../../../../shared/utils/custom-errors";
import { deleteImages, markFilesAsUsed } from "../../../../shared/utils/files";
import { createVarianstOfTheProduct } from "../../product-variants/variant.service";
import mongoose from "mongoose";

export class CreaetProductLogic {
  optionService: OptionService;

  constructor(optionService: OptionService) {
    this.optionService = optionService;
  }

  async create(input: Input, language: string = "en") {
    input = inputSchema.parse(input);

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
      throw new ValidationError("sale_price_higher_than_price");
    }

    if (
      input.paymentChoices === "installment" &&
      (!input.installmentOptions || !input.installmentOptions.length)
    ) {
      throw new ValidationError("installment_options_missing");
    }

    if (
      input.paymentChoices === "both" &&
      (!input.installmentOptions || !input.installmentOptions.length)
    ) {
      throw new ValidationError("installment_options_missing");
    }

    if (
      input.paymentChoices === "cash" &&
      input.installmentOptions &&
      input.installmentOptions.length
    ) {
      throw new ValidationError("installment_options_not_allowed");
    }

    const contracts = input.installmentOptions
      ? input.installmentOptions.map((i: any) => i.contract)
      : [];
    // mark images as used
    await markFilesAsUsed([...input.images, ...contracts]);

    // create the product
    const product = await Product.create(input);

    return product;
  }
}
