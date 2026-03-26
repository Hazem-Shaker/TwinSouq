"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingModule = void 0;
const settings_service_1 = require("./settings.service");
const settings_router_1 = require("./settings.router");
class SettingModule {
    constructor() {
        this.settingService = new settings_service_1.SettingService();
        this.settingRouter = new settings_router_1.SettingRouter(this.settingService);
    }
    routerFactory() {
        return this.settingRouter.createRouter();
    }
}
exports.SettingModule = SettingModule;
