"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchQuery = void 0;
const parseSearchQuery = (requestQuery) => {
    const { item } = requestQuery;
    const matchQuery = [];
    if (item) {
        matchQuery.push({
            $match: {
                item: item,
            },
        });
    }
    return matchQuery;
};
exports.parseSearchQuery = parseSearchQuery;
