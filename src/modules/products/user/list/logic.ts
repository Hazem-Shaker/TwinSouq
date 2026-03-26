import { parseSearchQuery } from "./query-parser";
import { Input, inputSchema } from "./input";
import Product from "../../product.model";
import { CategoryService } from "../../../categories/category.service";
import { prodcutListForUser } from "../../../../shared/utils/aggregations/product";

export class ListProductsForUserLogic {
  categoryService: CategoryService;
  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }
  async list(input: Input, language: string = "en") {
    const { pagination, query, user } = inputSchema.parse(input);
    const subCategories = await this.categoryService.getChildernIds(
      query.category ?? null
    );

    let sort: any = { createdAt: -1, views: -1, score: -1 };

    if (query.sort === "highest-price-first") {
      sort = { price: -1, views: -1, score: -1 };
    }
    if (query.sort === "lowest-price-first") {
      sort = { price: 1, views: -1, score: -1 };
    }
    if (query.sort === "latest-first") {
      sort = { createdAt: -1, views: -1, score: -1 };
    }
    if (query.sort === "oldest-first") {
      sort = { createdAt: 1, views: -1, score: -1 };
    }
    if (query.sort === "popular-first") {
      sort = { views: -1, createdAt: -1, score: -1 };
    }

    const favoriteAgg: any[] = [
      {
        $lookup: {
          from: "favorites",
          localField: "_id",
          foreignField: "item",
          as: "favorite",
          pipeline: [
            {
              $match: {
                user: user,
              },
            },
          ],
        },
      },

      {
        $set: {
          isFavorite: {
            $cond: {
              if: { $gt: [{ $size: "$favorite" }, 0] }, // Check if salePrice is not null
              then: true,
              else: false,
            },
          },
        },
      },
    ];

    const products = await Product.aggregate([
      ...parseSearchQuery(query, subCategories),
      {
        $addFields: { score: { $meta: "searchScore" } }, // Include the score in the result
      },
      { $sort: sort },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      ...(user
        ? favoriteAgg
        : [
            {
              $set: {
                isFavorite: false,
              },
            },
          ]),
      ...prodcutListForUser(language),
    ]);

    const countQuery: { totalResults: number }[] = await Product.aggregate([
      ...parseSearchQuery(query, subCategories),
      {
        $count: "totalResults", // ✅ Counts matching documents
      },
    ]);

    const totalCount = countQuery[0]?.totalResults ?? 0;
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: products,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
