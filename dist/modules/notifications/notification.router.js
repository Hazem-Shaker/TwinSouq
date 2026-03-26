"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRouter = void 0;
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const auth_1 = require("../../shared/middlewares/auth");
class NotificationRouter {
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.notificationController = new notification_controller_1.NotificationController(this.notificationService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
        this.providerAuthMiddleware = new auth_1.ProviderAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.get("/user/token", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.notificationController.getTokenForUser.bind(this.notificationController));
        router.get("/provider/token", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.notificationController.getTokenForProvider.bind(this.notificationController));
        return router;
    }
}
exports.NotificationRouter = NotificationRouter;
