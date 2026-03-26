import { Option } from "../option.model";
import { Input, inputSchema } from "./input";
import { optionsAggregation } from "../../../shared/utils/aggregations";

export class ListByCategoryIdLogic {
  async list(input: Input, language: string = "en", forAdmin: boolean = false) {
    // Validate and parse the input
    input = inputSchema.parse(input);

    const { categoryId } = input;

    // Define the language-specific field name

    // Use aggregation to fetch and transform the data
    const options = await Option.aggregate([
      // Match options by category ID
      { $match: { category: categoryId } },

      // Project the required fields with localized names
      ...optionsAggregation(language, forAdmin),
    ]);

    return options;
  }
}
