"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionRouter = void 0;
const option_controller_1 = require("./option.controller");
const express_1 = require("express");
const auth_1 = require("../../shared/middlewares/auth");
const auth_2 = require("../../shared/middlewares/auth");
class OptionRouter {
    constructor(optionService) {
        this.optionService = optionService;
        this.adminAuthMiddleware = new auth_1.AdminAuthMiddleware();
        this.userAuthMiddleware = new auth_2.UserAuthMiddleware();
        this.optionController = new option_controller_1.OptionController(this.optionService);
    }
    createRouter() {
        const router = (0, express_1.Router)();
        // Admin routes
        router
            .route("/admin")
            .post(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.optionController.createOption.bind(this.optionController));
        router
            .route("/admin/:id")
            .put(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.optionController.updateOption.bind(this.optionController))
            .delete(this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.optionController.deleteOption.bind(this.optionController));
        router.get("/admin/categories/:categoryId", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.optionController.listByCategoryIdForAdmin.bind(this.optionController));
        router.get("/admin/:id", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.optionController.getForAdmin.bind(this.optionController));
        // Public routes
        router
            .route("/categories/:categoryId")
            .get(this.optionController.listByCategoryId.bind(this.optionController));
        return router;
    }
}
exports.OptionRouter = OptionRouter;
