"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const get_token_1 = require("./get-token");
const send_notification_1 = require("./send-notification");
class NotificationService {
    constructor() {
        this.getTokenLogic = new get_token_1.GetTokenLogic();
        this.sendNotificationLogic = new send_notification_1.SendNotificationLogic();
    }
    getToken(userId, type) {
        return this.getTokenLogic.getToken({ userId, type });
    }
    sendNotification(type, data) {
        return this.sendNotificationLogic.execute({ type, ...data });
    }
}
exports.NotificationService = NotificationService;
