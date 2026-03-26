import Provider from "../provider.model";
import { Input, inputSchema } from "./input";
import { NoRouteFound } from "../../../shared/utils/custom-errors";

export class ProviderHomePageLogic {
  async execute(input: Input) {
    input = inputSchema.parse(input);

    const [provider] = await Provider.aggregate([
      {
        $match: {
          _id: input.provider,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "providerBalances",
          localField: "_id",
          foreignField: "provider",
          as: "balance",
        },
      },
      {
        $unwind: { path: "$balance", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          earnings: {
            $cond: {
              if: { $ne: ["$balance", null] },
              then: {
                $sum: ["$balance.availableBalance", "$balance.totalWithdrawn"],
              },
              else: 0,
            },
          },
          visits: "$views",
        },
      },
    ]);

    if (!provider) throw new NoRouteFound("provider_not_found");

    return provider;
  }
}
