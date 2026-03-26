import { paginationSchema, Pagination, querySchema, Query } from "./input";
import Category from "../category.model";
import { config } from "../../../shared/config";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import { ICategoryResponseData } from "../types";
import mongoose from "mongoose";
import { categoryAggregation } from "../../../shared/utils/aggregations";

export class ListLogic {
  async list(pagination: Pagination, query: Query, language: string = "en") {
    pagination = paginationSchema.parse(pagination);
    query = querySchema.parse(query);
    const { parent, name } = query;
    const matchQuery: any = {
      isActive: true,
    };
    if (parent) {
      if (mongoose.Types.ObjectId.isValid(parent)) {
        matchQuery.parent = new mongoose.Types.ObjectId(parent);
      } else if (parent === "null") {
        matchQuery.parent = null;
      } else {
        const parentObj = await Category.findOne({
          $or: [
            {
              slug_ar: parent,
            },
            {
              slug_en: parent,
            },
          ],
        });
        if (parentObj) {
          matchQuery.parent = parentObj._id;
        }
      }
    }

    if (name && typeof name === "string") {
      console.log(name);
      matchQuery.$or = [
        {
          name_ar: {
            $regex: `${name}`,
            $options: "i",
          },
        },
        {
          name_en: {
            $regex: `${name}`,
            $options: "i",
          },
        },
      ];
    }

    const categories = await Category.aggregate([
      { $match: { ...matchQuery } },
      { $skip: Number(pagination.skip) },
      { $limit: Number(pagination.limit) },
      ...categoryAggregation(language),
    ]);

    // caluclate number of pages
    const totalCount = await Category.countDocuments(matchQuery);
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: categories,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
