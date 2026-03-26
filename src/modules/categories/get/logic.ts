import { inputSchema, Input } from "./input";
import Category from "../category.model";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import { categoryAggregation } from "../../../shared/utils/aggregations";
import mongoose from "mongoose";

export class GetLogic {
  async get(slug: string, language: string) {
    const query: any = {};
    // filters
    if (mongoose.Types.ObjectId.isValid(slug)) {
      query._id = new mongoose.Types.ObjectId(slug);
    } else {
      query.$or = [
        {
          slug_ar: slug,
        },
        {
          slug_en: slug,
        },
      ];
    }

    // query
    const categories = await Category.aggregate([
      {
        $match: {
          ...query,
          isActive: true,
        },
      },
      ...categoryAggregation(language),
    ]);

    if (!categories.length) {
      throw new NotFoundError("categoryNotFound"); // Use error key
    }

    return categories[0];
  }
}
