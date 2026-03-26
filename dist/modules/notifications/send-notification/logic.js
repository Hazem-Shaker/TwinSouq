"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendNotificationLogic = void 0;
const notification_model_1 = __importDefault(require("../notification.model"));
const utils_1 = require("../utils");
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class SendNotificationLogic {
    constructor() { }
    async execute(input) {
        const { type, target, title_ar, title_en, body_ar, body_en, data, app } = input_1.sendNotificationInputSchema.parse(input);
        const { type: targetType, id } = target;
        switch (targetType) {
            case "user":
                return this.sendToUser(id, {
                    type,
                    title_ar,
                    title_en,
                    body_ar,
                    body_en,
                    data,
                    app,
                });
            case "interest":
                return this.sendToInterest(id, {
                    type,
                    title_ar,
                    title_en,
                    body_ar,
                    body_en,
                    data,
                    app,
                });
            default:
                throw new custom_errors_1.ValidationError("wrong_target_type");
        }
    }
    async sendToUser(id, { type, app, title_ar, title_en, body_ar, body_en, data, }) {
        const notificationData = {
            target: "user",
            app,
            user: id,
            title_ar,
            title_en,
            message_ar: body_ar,
            message_en: body_en,
            type,
            data,
        };
        const notification = new notification_model_1.default(notificationData);
        await notification.save();
        await (0, utils_1.sendNotificationToUsers)([`${app === "both" ? "user" : app}-${id.toString()}`], { ar: title_ar, en: title_en }, { ar: body_ar, en: body_en }, data);
        return notification;
    }
    async sendToInterest(interest, { type, title_ar, title_en, body_ar, body_en, data, app, }) {
        const notificationData = {
            target: "interest",
            title_ar,
            title_en,
            body_ar,
            body_en,
            data,
            app,
        };
        const notification = new notification_model_1.default(notificationData);
        await notification.save();
        await (0, utils_1.sendNotificationToInterest)(interest, { ar: title_ar, en: title_en }, { ar: body_ar, en: body_en }, data);
        return notification;
    }
}
exports.SendNotificationLogic = SendNotificationLogic;
