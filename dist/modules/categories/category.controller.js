"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async createCategory(req, res, next) {
        try {
            const response = await this.categoryService.createCategory(req.body, req.language);
            res.sendSuccess(req.t("category.created"), response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getCategory(req, res, next) {
        try {
            const response = await this.categoryService.getCategory(req.params.slug, req.language);
            res.sendSuccess("Category fetched successfully", response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getCategoryForAdmin(req, res, next) {
        try {
            const response = await this.categoryService.getCategoryForAdmin(req.params.id);
            res.sendSuccess("Category fetched successfully", response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async listCategories(req, res, next) {
        try {
            const { pagination, query } = req;
            const response = await this.categoryService.listCategories(pagination ?? {}, query ?? {}, req.language);
            res.sendSuccess(req.t("category.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async listCategoriesForAdmin(req, res, next) {
        try {
            const { pagination, filter } = req;
            const response = await this.categoryService.listCategoriesForAdmin(pagination ?? {}, req.query.filter);
            res.sendSuccess("Category fetched successfully", response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async updateCategory(req, res, next) {
        try {
            const response = await this.categoryService.updateCategory(req.params.id, req.body, req.language);
            res.sendSuccess(req.t("category.updated"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const response = await this.categoryService.deleteCategory(req.params.slug);
            res.sendSuccess("Category deleted successfully", response, 204);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
