"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const admin_controller_1 = require("./admin.controller");
const express_1 = require("express");
const upload_1 = require("../../shared/middlewares/upload");
class AdminRouter {
    constructor(adminService, adminAuthMiddleware) {
        this.adminService = adminService;
        this.adminAuthMiddleware = adminAuthMiddleware;
        this.adminController = new admin_controller_1.AdminController(this.adminService);
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.post("/create", upload_1.upload.any(), this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.adminController.createAdmin.bind(this.adminController));
        router.post("/login", upload_1.upload.any(), this.adminController.login.bind(this.adminController));
        return router;
    }
}
exports.AdminRouter = AdminRouter;
