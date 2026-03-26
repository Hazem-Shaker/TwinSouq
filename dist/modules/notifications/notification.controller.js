"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getTokenForUser(req, res, next) {
        try {
            const response = await this.notificationService.getToken(req.user.id, "customer");
            res.sendSuccess(req.t("notifications.token_generated"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getTokenForProvider(req, res, next) {
        try {
            const response = await this.notificationService.getToken(req.user.id, "provider");
            res.send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationController = NotificationController;
