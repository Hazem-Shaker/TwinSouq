import Review from "../review.model";
import { Input, inputSchema } from "./input";
export class GetReviewsStatsLogic {
  constructor() {}

  async get(input: Input, language: string = "en") {
    const { query } = inputSchema.parse(input);
    const { item } = query;
    const reviewsDetails = await Review.aggregate([
      {
        $match: {
          item: item,
        },
      },
      {
        $group: {
          _id: "$rating", // Group by rating
          count: { $sum: 1 }, // Count reviews for each rating
        },
      },
      {
        $project: {
          _id: 0,
          rating: "$_id",
          count: 1,
        },
      },
      {
        $facet: {
          ratingBreakdown: [
            { $sort: { rating: -1 } }, // Sort ratings in ascending order
          ],
          overallStats: [
            {
              $group: {
                _id: null,
                totalReviews: { $sum: "$count" }, // Total number of reviews
                weightedSum: { $sum: { $multiply: ["$rating", "$count"] } }, // Sum of (rating * count)
              },
            },
            {
              $project: {
                _id: 0,
                totalReviews: 1,
                averageRating: {
                  $cond: {
                    if: { $gt: ["$totalReviews", 0] },
                    then: { $divide: ["$weightedSum", "$totalReviews"] },
                    else: 0, // Avoid division by zero
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          ratingBreakdown: 1,
          totalReviews: { $arrayElemAt: ["$overallStats.totalReviews", 0] },
          averageRating: { $arrayElemAt: ["$overallStats.averageRating", 0] },
        },
      },
    ]);

    const response: {
      totalReviews: number;
      averageRating: number;
      ratingBreakdown: {
        rating: number;
        count: number;
      }[];
    } = reviewsDetails[0];

    for (let rating = 1; rating <= 5; rating++) {
      if (!response.ratingBreakdown.find((value) => value.rating === rating)) {
        response.ratingBreakdown.push({
          count: 0,
          rating,
        });
      }
    }

    response.ratingBreakdown = response.ratingBreakdown.sort(
      (a, b) => a.rating - b.rating
    );

    return response;
  }
}
