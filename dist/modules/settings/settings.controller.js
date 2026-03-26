"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingController = void 0;
class SettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    async getSettingForAdmin(req, res, next) {
        try {
            const response = await this.settingService.getSettingForAdmin(req.language);
            res.sendSuccess(req.t("settings.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getSetting(req, res, next) {
        try {
            const response = await this.settingService.getSetting(req.language);
            res.sendSuccess(req.t("settings.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async updateSetting(req, res, next) {
        try {
            const response = await this.settingService.updateSetting(req.body, req.language);
            res.sendSuccess(req.t("settings.updated"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SettingController = SettingController;
