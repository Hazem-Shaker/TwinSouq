"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryAggregation = void 0;
const images_1 = require("./images");
const categoryAggregation = (language) => {
    const agg = [
        ...(0, images_1.imageAggregate)("image", true),
        // aggregate parent data
        {
            $lookup: {
                from: "catgories",
                localField: "parent",
                foreignField: "_id",
                as: "parent",
            },
        },
        {
            $set: {
                id: "$_id",
            },
        },
    ];
    if (language === "en") {
        agg.push({
            $project: {
                id: 1,
                name: "$name_en",
                slug: "$slug_en",
                image: "$image.url",
                description: "$description_en",
            },
        });
    }
    else if (language === "ar") {
        agg.push({
            $project: {
                id: 1,
                name: "$name_ar",
                slug: "$slug_ar",
                image: "$image.url",
                description: "$description_ar",
            },
        });
    }
    return agg;
};
exports.categoryAggregation = categoryAggregation;
