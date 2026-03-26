import { Option } from "../option.model";
import { Input, inputSchema } from "./input";
import { optionsAggregation } from "../../../shared/utils/aggregations";
import { NotFoundError } from "../../../shared/utils/custom-errors";
export class GetForAdminLogic {
  async list(input: Input, language: string = "en") {
    // Validate and parse the input
    input = inputSchema.parse(input);

    const { id } = input;

    const options = await Option.aggregate([
      { $match: { _id: id } },
      {
        $project: {
          id: "$_id",
          _id: 0,
          name_en: 1, // Use the appropriate language field
          name_ar: 1, // Use the appropriate language field
          values: {
            $map: {
              input: "$values",
              as: "value",
              in: {
                id: "$$value.id",
                name_en: "$$value.name_en",
                name_ar: "$$value.name_ar",
              },
            },
          },
        },
      },
    ]);

    if (!options.length) {
      throw new NotFoundError("option_not_found");
    }

    return options[0];
  }
}
