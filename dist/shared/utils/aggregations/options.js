"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsAggregation = void 0;
const optionsAggregation = (language = "en", forAdmin = false) => {
    return [
        {
            $project: {
                ...(forAdmin ? { id: "$_id", _id: 0 } : { _id: 0, id: 1 }),
                name: language === "ar" ? "$name_ar" : "$name_en", // Use the appropriate language field
                values: {
                    $map: {
                        input: "$values",
                        as: "value",
                        in: {
                            id: "$$value.id",
                            name: language === "ar" ? "$$value.name_ar" : "$$value.name_en", // Localize value names
                            metadata: "$$value.metadata", // Include metadata
                        },
                    },
                },
            },
        },
    ];
};
exports.optionsAggregation = optionsAggregation;
