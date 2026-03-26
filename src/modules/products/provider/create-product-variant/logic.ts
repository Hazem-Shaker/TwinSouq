import Product from "../../product.model";
import Variant from "../../product-variants/variant.model";
import { inputSchema, Input } from "./input";
import { OptionService } from "../../../options/option.service";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../../../../shared/utils/custom-errors";
import { deleteImages, markFilesAsUsed } from "../../../../shared/utils/files";
import { getOptionsString } from "../../product-variants/variant.service";

export class CreateProductVariantLogic {
  optionService: OptionService;

  constructor(optionService: OptionService) {
    this.optionService = optionService;
  }
  async create(input: Input, provider: any, language: string = "en") {
    input = inputSchema.parse(input);

    const product = await Product.findById(input.product);

    if (!product) {
      throw new NotFoundError("product_not_found");
    }

    if (product.provider.toString() !== provider) {
      throw new NotFoundError("product_not_found");
    }

    const options = await this.optionService.listByCategoryId(
      product.category,
      language
    );

    if (input.salePrice && input.price && input.salePrice > input.price) {
      throw new ValidationError("sale_price_higher_than_price");
    }

    if (input.options.length !== options.length) {
      throw new ValidationError("product_options_not_complete");
    }

    input.options.forEach((option) => {
      const existingOption = options.find((value) => option.key === value.id);
      if (!existingOption) {
        throw new ValidationError("wrong_option_key");
      }

      const existingValue = existingOption.values.find(
        (value: any) => option.value === value.id
      );
      if (!existingValue) {
        throw new ValidationError("wrong_option_value");
      }
    });

    const variantExist = await Variant.findOne({
      product: input.product, // NEW
      optionsString: getOptionsString(input.options),
    });

    if (variantExist) {
      throw new ConflictError("varaint_exist");
    }

    // mark images as used
    if (input.images) await markFilesAsUsed(input.images.map((i) => i._id));

    // create variant
    const variant = await Variant.create({
      ...input,
      optionsString: getOptionsString(input.options),
    });

    return variant;
  }
}
