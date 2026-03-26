"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwindQuery = void 0;
const unwindQuery = (fieldName, yes) => {
    return yes
        ? [
            {
                $unwind: {
                    path: `$${fieldName}`,
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]
        : [];
};
exports.unwindQuery = unwindQuery;
