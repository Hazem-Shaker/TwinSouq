"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateCartData = exports.productData = void 0;
const aggregations_1 = require("../../../../shared/utils/aggregations");
const productData = (language = "en") => {
    const projection = [];
    if (language === "ar") {
        projection.push({
            $project: {
                id: "$_id",
                name: "$name_ar",
                description: "$description_ar",
                price: 1,
                salePrice: 1,
                views: 1,
                provider: 1,
                image: { $arrayElemAt: ["$images", 0] },
            },
        });
    }
    if (language === "en") {
        projection.push({
            $project: {
                id: "$_id",
                name: "$name_en",
                description: "$description_en",
                price: 1,
                salePrice: 1,
                views: 1,
                provider: 1,
                image: { $arrayElemAt: ["$images", 0] },
            },
        });
    }
    return [...(0, aggregations_1.imageAggregate)("images", false), ...projection];
};
exports.productData = productData;
const aggregateCartData = (language = "en") => {
    return [
        {
            $unwind: {
                path: "$products",
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "products.product",
                foreignField: "_id",
                as: "products.product",
                pipeline: [...(0, exports.productData)(language)],
            },
        },
        {
            $unwind: {
                path: "$products.product",
            },
        },
        {
            $group: {
                _id: null,
                products: { $push: "$products" },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ];
};
exports.aggregateCartData = aggregateCartData;
