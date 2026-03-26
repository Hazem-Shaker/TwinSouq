import { inputSchema, Input } from "./input";
import Category from "../category.model";
import {
  ConflictError,
  BadRequestError,
} from "../../../shared/utils/custom-errors";
import { slugify } from "../../../shared/utils/slugify";
import { deleteImages, markFilesAsUsed } from "../../../shared/utils/files";

export class CreateLogic {
  async create(data: Input, language: string = "en") {
    data = inputSchema.parse(data);

    const slug_ar = slugify(data.name_ar);
    let categoryExist = await Category.findOne({ slug_ar });
    if (categoryExist) {
      throw new ConflictError("arabicCategoryExists"); // Use error key
    }

    const slug_en = slugify(data.name_en);
    categoryExist = await Category.findOne({ slug_en });
    if (categoryExist) {
      throw new ConflictError("englishCategoryExists"); // Use error key
    }

    if (data.parent) {
      if (!data.profitPercentage) {
        throw new BadRequestError("profit_percentage_required");
      }
    }

    const category = await Category.create({
      ...data,
      image: data.image[0]._id,
    });

    await markFilesAsUsed(data.image.map((i) => i._id));

    return category;
  }
}
