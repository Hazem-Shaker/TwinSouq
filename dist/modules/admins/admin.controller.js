"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createAdmin(req, res, next) {
        try {
            const response = await this.adminService.createAdmin(req.body);
            res.sendSuccess("Admin created successfully", response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const response = await this.adminService.login(req.body);
            res.sendSuccess("Admin logged in successfully", response, 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
