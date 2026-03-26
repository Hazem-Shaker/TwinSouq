"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateProvider = void 0;
const unwind_1 = require("./unwind");
const images_1 = require("./images");
const aggregateProvider = (detailed = false) => {
    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            user_id: "$_id",
                            name: 1,
                            email: 1,
                            phone: 1,
                            address: 1,
                        },
                    },
                ],
            },
        },
        ...(0, unwind_1.unwindQuery)("user", true),
        ...(0, images_1.imageAggregate)("idImage.front", true),
        ...(0, images_1.imageAggregate)("idImage.back", true),
        ...(0, images_1.imageAggregate)("photo", true),
    ];
    if (detailed === false) {
        pipeline.push({
            $project: {
                photo: 1,
                name: "$user.name",
                address: 1,
                email: "$user.email",
            },
        });
    }
    const query = [
        {
            $lookup: {
                from: "providers",
                localField: "provider",
                foreignField: "_id",
                as: "provider",
                pipeline,
            },
        },
        ...(0, unwind_1.unwindQuery)("provider", true),
    ];
    return query;
};
exports.aggregateProvider = aggregateProvider;
