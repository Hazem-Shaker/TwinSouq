"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchQuery = void 0;
const parseSearchQuery = (requestQuery, provider) => {
    const { query, archive } = requestQuery;
    const search = {
        index: "products",
        compound: {},
    };
    // Initialize must and filter arrays
    const must = [
        {
            equals: {
                path: "provider",
                value: provider,
            },
        },
    ];
    const filter = [
        {
            equals: {
                path: "archive",
                value: archive,
            },
        },
    ];
    // Add query-based search
    if (query) {
        must.push({
            text: {
                query: query,
                path: ["name_ar", "name_en"],
                fuzzy: { maxEdits: 2 },
            },
        });
    }
    // Assign non-empty must and filter arrays
    if (must.length > 0)
        search.compound.must = must;
    if (filter.length > 0)
        search.compound.filter = filter;
    // **Ensure compound is never empty**
    if (!search.compound.must && !search.compound.filter) {
        search.compound.must = [{ exists: { path: "_id" } }]; // Dummy condition to avoid an empty compound
    }
    let matchQuery = [
        {
            $search: search,
        },
        {
            $project: {
                _id: 1,
                name_ar: 1,
                name_en: 1,
                price: 1,
                views: 1,
                salePrice: 1,
                rating: 1,
                category: 1,
                description_ar: 1,
                description_en: 1,
                updatedAt: 1,
                images: 1,
            },
        },
    ];
    return matchQuery;
};
exports.parseSearchQuery = parseSearchQuery;
