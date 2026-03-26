import Review from "../review.model";
import { Input, inputSchema } from "./input";
import { parseSearchQuery } from "./query-parser";
export class ListReviewsLogic {
  constructor() {}

  async list(input: Input, language: string = "en") {
    const { pagination, query } = inputSchema.parse(input);

    const { sort } = query;
    let sortObj: any = {};

    switch (sort) {
      case "highest":
        sortObj = { rating: -1 };
        break;
      case "lowest":
        sortObj = { rating: 1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const reviews = await Review.aggregate([
      ...parseSearchQuery(query),
      { $sort: sortObj },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                name: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $set: {
          user: "$user.name",
        },
      },
      {
        $project: {
          id: "$_id",
          user: 1,
          rating: 1,
          comment: 1,
          date: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } },
          _id: 0,
        },
      },
    ]);

    const totalCount = await Review.countDocuments(
      query.item
        ? {
            item: query.item,
          }
        : {}
    );
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: reviews,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
