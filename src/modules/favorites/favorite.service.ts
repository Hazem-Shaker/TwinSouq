import { AddInput, addInputSchema, listInputSchema, ListInput } from "./input";
import Favorite from "./favorite.model";
import { ConflictError, NotFoundError } from "../../shared/utils/custom-errors";
import { prodcutListForUser } from "../../shared/utils/aggregations/product";

export class FavoriteService {
  constructor() {}

  async add(input: AddInput) {
    input = addInputSchema.parse(input);

    const exisingFavorite = await Favorite.findOne({
      user: input.user,
      item: input.item,
    });

    if (exisingFavorite) {
      throw new ConflictError("item_already_in_favorites");
    }

    const favorite = await Favorite.create(input);

    return favorite;
  }

  async remove(input: AddInput) {
    input = addInputSchema.parse(input);

    const exisingFavorite = await Favorite.findOne({
      user: input.user,
      item: input.item,
    });

    if (!exisingFavorite) {
      throw new NotFoundError("item_not_found");
    }

    await Favorite.findByIdAndDelete(exisingFavorite._id);

    return null;
  }

  async listFavorites(input: ListInput, language: string = "en") {
    const { user, pagination } = listInputSchema.parse(input);

    const favorites = await Favorite.aggregate([
      {
        $match: {
          user: user,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      {
        $lookup: {
          from: "products",
          localField: "item",
          foreignField: "_id",
          as: "product",
          pipeline: [
            { $set: { isFavorite: true } },
            ...prodcutListForUser(language),
          ],
        },
      },
      {
        $set: {
          item: { $arrayElemAt: ["$product", 0] },
        },
      },
      { $project: { item: 1, _id: 0 } },
    ]);

    const totalCount = await Favorite.countDocuments({ user });
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: favorites,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
