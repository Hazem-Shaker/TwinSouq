"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.beamsClient = void 0;
const push_notifications_server_1 = __importDefault(require("@pusher/push-notifications-server"));
const config_1 = require("../../../shared/config");
exports.beamsClient = new push_notifications_server_1.default({
    instanceId: config_1.config.pusher.instanceId, // Add to your .env
    secretKey: config_1.config.pusher.secretKey, // Add to your .env
});
