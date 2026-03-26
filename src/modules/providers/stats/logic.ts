import { Input, inputSchema } from "./input";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import Provider from "../provider.model";

export class ProviderStatsLogic {
  async execute(input: Input) {
    const { provider } = inputSchema.parse(input);

    const [providerStats] = await Provider.aggregate([
      { $match: { _id: provider } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "provider",
          as: "products",
        },
      },
      {
        $project: {
          views: 1,
          rating: { $round: ["$rating", 2] },
          productsCount: {
            $size: {
              $filter: {
                input: "$products",
                as: "product",
                cond: { $eq: ["$$product.archive", false] },
              },
            },
          },
          archivedProductsCount: {
            $size: {
              $filter: {
                input: "$products",
                as: "product",
                cond: { $eq: ["$$product.archive", true] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    if (!providerStats) {
      throw new NotFoundError("Provider not found");
    }

    return providerStats;
  }
}
