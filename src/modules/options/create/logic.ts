// create-option.logic.ts
import { optionInputSchema, OptionInput } from "./input";
import { Option } from "../option.model";
import { ConflictError } from "../../../shared/utils/custom-errors";
import { slugify } from "../../../shared/utils/slugify";
import { CategoryService } from "../../categories/category.service";
export class CreateOptionLogic {
  constructor(private categoryService: CategoryService) {}
  async create(data: OptionInput, language: string = "en") {
    // Validate input data
    data = optionInputSchema.parse(data);

    // Check for conflicts in Arabic name
    const slug_ar = slugify(data.name_ar);
    // let optionExist = await Option.findOne({ slug_ar });
    // if (optionExist) {
    //   throw new ConflictError("arabicOptionExists"); // Use error key
    // }

    // Check for conflicts in English name
    const slug_en = slugify(data.name_en);
    // optionExist = await Option.findOne({ slug_en });
    // if (optionExist) {
    //   throw new ConflictError("englishOptionExists"); // Use error key
    // }

    const category = await this.categoryService.getForOptions(data.category);

    // Check if any of the value IDs already exist in other options
    // const valueIds = data.values.map(value => value.id);
    // const existingValueId = await Option.findOne({ 'values.id': { $in: valueIds } }, { 'values.$': 1 });

    // if (existingValueId) {
    //   const duplicateValueId = existingValueId.values[0].id;
    //   throw new ConflictError(`valueIdExists:${duplicateValueId}`);
    // }

    // Create the option
    const option = await Option.create({
      ...data,
      slug_ar,
      slug_en,
      id: category.slug_en + "-" + slug_en,
    });

    return option;
  }
}
