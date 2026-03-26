"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductForUserLogic = void 0;
const input_1 = require("./input");
const product_model_1 = __importDefault(require("../../product.model"));
const variant_model_1 = __importDefault(require("../../product-variants/variant.model"));
const productViews_model_1 = __importDefault(require("../../productViews.model"));
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const agg_1 = require("./agg");
class GetProductForUserLogic {
    constructor(providerService) {
        this.providerService = providerService;
    }
    async get(input, language = "en") {
        const { id, query, user } = input_1.inputSchema.parse(input);
        let { variant } = query;
        if (!variant) {
            const productVariants = await variant_model_1.default.find({ product: id }).sort({
                stock: -1,
            });
            variant = productVariants.length ? productVariants[0]._id : null;
        }
        const favoriteAgg = [
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
        const product = await product_model_1.default.aggregate([
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
            ...(0, agg_1.aggregateProductDetails)(language),
        ]);
        if (!product.length) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        const variantDetails = await variant_model_1.default.aggregate([
            {
                $match: {
                    _id: variant,
                },
            },
            ...(0, agg_1.aggregateVariantDetails)(language),
        ]);
        let variantData = {};
        if (!variantDetails.length) {
            variantData = {
                stock: 0,
                options: [],
            };
        }
        else {
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
        const variantsArray = await variant_model_1.default.aggregate([
            {
                $match: {
                    product: id,
                },
            },
            ...(0, agg_1.aggregateVariantList)(language),
        ]);
        if (user) {
            const productView = await productViews_model_1.default.findOne({
                product: id,
                user: user,
            });
            if (!productView) {
                await productViews_model_1.default.create({ product: id, user: user });
                const productObj = await product_model_1.default.findByIdAndUpdate(id, {
                    $inc: { views: 1 },
                });
                if (productObj) {
                    await this.providerService.increaseProviderViews(productObj.provider, user);
                }
            }
        }
        return { ...product[0], ...variantData, variantsList: variantsArray };
    }
}
exports.GetProductForUserLogic = GetProductForUserLogic;
