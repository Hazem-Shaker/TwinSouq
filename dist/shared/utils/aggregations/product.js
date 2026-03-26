"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prodcutListForUser = exports.productDetailsForProvider = exports.productListForProvider = void 0;
const images_1 = require("./images");
const unwind_1 = require("./unwind");
const productListForProvider = (language = "en") => {
    const projection = [];
    if (language === "ar") {
        projection.push({
            $project: {
                id: "$_id",
                name: "$name_ar",
                description: "$description_ar",
                price: 1,
                salePrice: 1,
                category: 1,
                views: 1,
                image: { $arrayElemAt: ["$images", 0] },
                lastModified: {
                    $dateToString: {
                        format: "%d/%m/%Y",
                        date: "$updatedAt",
                    },
                },
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
                category: 1,
                views: 1,
                image: { $arrayElemAt: ["$images", 0] },
                lastModified: {
                    $dateToString: {
                        format: "%d/%m/%Y",
                        date: "$updatedAt",
                    },
                },
            },
        });
    }
    return [...(0, images_1.imageAggregate)("images", false), ...projection];
};
exports.productListForProvider = productListForProvider;
const productDetailsForProvider = (language = "en") => {
    return [
        ...(0, images_1.imageAggregate)("images", false),
        ...(0, unwind_1.unwindQuery)("installmentOptions", true),
        ...(0, images_1.imageAggregate)("installmentOptions.contract"),
        {
            $group: {
                _id: "$_id", // Group by the original document ID
                root: { $first: "$$ROOT" }, // Preserve the original document structure
                installmentOptions: { $push: "$installmentOptions" }, // Rebuild the optionsDetails array
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        "$root",
                        { installmentOptions: "$installmentOptions" },
                    ],
                },
            },
        },
    ];
};
exports.productDetailsForProvider = productDetailsForProvider;
const prodcutListForUser = (language = "en") => {
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
                image: { $arrayElemAt: ["$images", 0] },
                rating: 1,
                isFavorite: 1,
                salePercent: {
                    $cond: {
                        if: { $ne: ["$salePrice", null] }, // Check if salePrice is not null
                        then: {
                            $floor: {
                                // Floor the value
                                $multiply: [
                                    {
                                        $divide: [
                                            { $subtract: ["$price", "$salePrice"] },
                                            "$price",
                                        ],
                                    },
                                    100,
                                ],
                            },
                        },
                        else: null, // Return null if salePrice is null
                    },
                },
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
                image: { $arrayElemAt: ["$images", 0] },
                rating: 1,
                isFavorite: 1,
                salePercent: {
                    $cond: {
                        if: { $ne: ["$salePrice", null] }, // Check if salePrice is not null
                        then: {
                            $floor: {
                                // Floor the value
                                $multiply: [
                                    {
                                        $divide: [
                                            { $subtract: ["$price", "$salePrice"] },
                                            "$price",
                                        ],
                                    },
                                    100,
                                ],
                            },
                        },
                        else: null, // Return null if salePrice is null
                    },
                },
            },
        });
    }
    return [...(0, images_1.imageAggregate)("images", false), ...projection];
};
exports.prodcutListForUser = prodcutListForUser;
