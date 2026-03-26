"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageAggregate = void 0;
const unwind_1 = require("./unwind");
const imageAggregate = (fieldName, unwind = true) => [
    {
        $lookup: {
            from: "files",
            localField: fieldName,
            foreignField: "_id",
            as: fieldName,
            pipeline: [
                {
                    $project: {
                        url: 1,
                        _id: 0,
                    },
                },
            ],
        },
    },
    ...(0, unwind_1.unwindQuery)(fieldName, unwind),
];
exports.imageAggregate = imageAggregate;
