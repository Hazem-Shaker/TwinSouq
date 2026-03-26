"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationMiddleware = (req, res, next) => {
    const query = req.query;
    let { limit, page } = query;
    delete query.limit;
    delete query.page;
    if (!page)
        page = 1;
    if (!limit)
        limit = 10;
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);
    const skip = page > 1 ? (page - 1) * limit : 0;
    const paginationResult = {
        query,
        pagination: {
            page,
            limit,
            skip,
        },
    };
    req.query = paginationResult.query;
    req.pagination = paginationResult.pagination;
    console.log(paginationResult);
    next();
};
exports.default = paginationMiddleware;
