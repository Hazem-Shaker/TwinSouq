"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileAggregate = void 0;
const unwind_1 = require("./unwind");
const fileAggregate = (fieldName, unwind = true) => [
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
                        type: 1,
                        _id: 0,
                    },
                },
            ],
        },
    },
    ...(0, unwind_1.unwindQuery)(fieldName, unwind),
];
exports.fileAggregate = fileAggregate;
