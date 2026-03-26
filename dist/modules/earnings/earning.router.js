"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningRouter = void 0;
const express_1 = require("express");
const earning_controller_1 = require("./earning.controller");
const auth_1 = require("../../shared/middlewares/auth");
const pagination_1 = __importDefault(require("../../shared/middlewares/pagination"));
class EarningRouter {
    constructor(earningService) {
        this.earningService = earningService;
        this.earningController = new earning_controller_1.EarningController(this.earningService);
        this.providerAuthMiddleware = new auth_1.ProviderAuthMiddleware();
        this.adminAuthMiddleware = new auth_1.AdminAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.get("/wallet", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.earningController.getWalletBalance.bind(this.earningController));
        router.post("/withdraw", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.earningController.withdraw.bind(this.earningController));
        router.patch("/admin/payout/:id", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.earningController.confirmPayout.bind(this.earningController));
        router.get("/admin/payouts", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), pagination_1.default, this.earningController.getPayoutsForAdmin.bind(this.earningController));
        return router;
    }
}
exports.EarningRouter = EarningRouter;
