import { Input, inputSchema } from "./input";
import Product from "../../product.model";
import Variant from "../../product-variants/variant.model";
import ProductViews from "../../productViews.model";
import { NotFoundError } from "../../../../shared/utils/custom-errors";
import {
  aggregateProductDetails,
  aggregateVariantDetails,
  aggregateVariantList,
} from "./agg";
import { ProviderService } from "../../../providers/provider.service";

export class GetProductForUserLogic {
  constructor(private providerService: ProviderService) {}

  async get(input: Input, language: string = "en") {
    const { id, query, user } = inputSchema.parse(input);
    let { variant } = query;
    if (!variant) {
      const productVariants = await Variant.find({ product: id }).sort({
        stock: -1,
      });
      variant = productVariants.length ? productVariants[0]._id : null;
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

    const product = await Product.aggregate([
      {
        $match: {
          _id: id,
          archive: false,
        },
      },
      ...(user
        ? favoriteAgg
        : [
            {
              $set: {
                isFavorite: false,
              },
            },
          ]),
      ...aggregateProductDetails(language),
    ]);

    if (!product.length) {
      throw new NotFoundError("product_not_found");
    }

    const variantDetails = await Variant.aggregate([
      {
        $match: {
          _id: variant,
        },
      },
      ...aggregateVariantDetails(language),
    ]);
    let variantData: any = {};
    if (!variantDetails.length) {
      variantData = {
        stock: 0,
        options: [],
      };
    } else {
      variantData = variantDetails[0];
    }

    if (!variantData?.images?.length) {
      delete variantData.images;
    }

    if (!variantData.price) {
      delete variantData.price;
    }
    if (!variantData.salePrice) {
      delete variantData.salePrice;
    }

    const variantsArray = await Variant.aggregate([
      {
        $match: {
          product: id,
        },
      },
      ...aggregateVariantList(language),
    ]);

    if (user) {
      const productView = await ProductViews.findOne({
        product: id,
        user: user,
      });
      if (!productView) {
        await ProductViews.create({ product: id, user: user });
        const productObj = await Product.findByIdAndUpdate(id, {
          $inc: { views: 1 },
        });
        if (productObj) {
          await this.providerService.increaseProviderViews(
            productObj.provider,
            user
          );
        }
      }
    }

    return { ...product[0], ...variantData, variantsList: variantsArray };
  }
}
