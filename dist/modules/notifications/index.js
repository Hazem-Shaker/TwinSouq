"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const notification_service_1 = require("./notification.service");
const notification_router_1 = require("./notification.router");
class NotificationModule {
    constructor() {
        this.notificationService = new notification_service_1.NotificationService();
        this.notificationRouter = new notification_router_1.NotificationRouter(this.notificationService);
    }
    routerFactory() {
        return this.notificationRouter.createRouter();
    }
}
exports.NotificationModule = NotificationModule;
