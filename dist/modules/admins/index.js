"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const admin_service_1 = require("./admin.service");
const admin_router_1 = require("./admin.router");
class AdminModule {
    constructor(adminAuthMiddleware) {
        this.adminAuthMiddleware = adminAuthMiddleware;
        this.adminService = new admin_service_1.AdminService();
        this.adminRouter = new admin_router_1.AdminRouter(this.adminService, this.adminAuthMiddleware);
    }
    routerFactory() {
        return this.adminRouter.createRouter();
    }
}
exports.AdminModule = AdminModule;
