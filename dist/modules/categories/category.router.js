"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = void 0;
const category_controller_1 = require("./category.controller");
const express_1 = require("express");
const auth_1 = require("../../shared/middlewares/auth");
const auth_2 = require("../../shared/middlewares/auth");
const pagination_1 = __importDefault(require("../../shared/middlewares/pagination"));
const upload_1 = require("../../shared/middlewares/upload");
class CategoryRouter {
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.adminAuthMiddleware = new auth_1.AdminAuthMiddleware();
        this.userAuthMiddleware = new auth_2.UserAuthMiddleware();
        this.categoryController = new category_controller_1.CategoryController(this.categoryService);
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router
            .route("/admin")
            .post(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), upload_1.upload.fields([
            {
                name: "image",
                maxCount: 1,
            },
        ]), (0, upload_1.processImagesMiddleware)(["image"]), this.categoryController.createCategory.bind(this.categoryController))
            .get(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), pagination_1.default, this.categoryController.listCategoriesForAdmin.bind(this.categoryController));
        router
            .route("/admin/:id")
            .get(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.categoryController.getCategoryForAdmin.bind(this.categoryController))
            .put(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), upload_1.upload.fields([
            {
                name: "image",
                maxCount: 1,
            },
        ]), (0, upload_1.processImagesMiddleware)(["image"]), this.categoryController.updateCategory.bind(this.categoryController));
        router
            .route("/admin/:slug")
            .delete(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.categoryController.deleteCategory.bind(this.categoryController));
        router
            .route("/")
            .get(pagination_1.default, this.categoryController.listCategories.bind(this.categoryController));
        router
            .route("/:slug")
            .get(this.categoryController.getCategory.bind(this.categoryController));
        return router;
    }
}
exports.CategoryRouter = CategoryRouter;
