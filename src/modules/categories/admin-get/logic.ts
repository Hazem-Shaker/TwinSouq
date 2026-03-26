import { inputSchema, Input } from "./input";
import Category from "../category.model";
import { config } from "../../../shared/config";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import { imageAggregate } from "../../../shared/utils/aggregations";
import { ICategoryAdminResponse } from "./types";

export class GetLogicForAdmin {
  async getForAdmin(input: Input): Promise<ICategoryAdminResponse> {
    const { id } = inputSchema.parse(input);
    const category = await Category.aggregate([
      { $match: { _id: id } },
      ...imageAggregate("image", true),
      {
        $project: {
          id: "$_id",
          _id: 0,
          name_ar: 1,
          name_en: 1,
          description_ar: 1,
          description_en: 1,
          parent: 1,
          image: 1,
          profitPercentage: 1,
        },
      },
    ]);

    if (category.length === 0) {
      throw new NotFoundError("category_not_found");
    }

    return category[0];
  }
}
