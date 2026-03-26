"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingRouter = void 0;
const settings_controller_1 = require("./settings.controller");
const express_1 = require("express");
const auth_1 = require("../../shared/middlewares/auth");
const upload_1 = require("../../shared/middlewares/upload");
class SettingRouter {
    constructor(settingService) {
        this.SettingService = settingService;
        this.adminAuthMiddleware = new auth_1.AdminAuthMiddleware();
        this.settingController = new settings_controller_1.SettingController(this.SettingService);
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.get("/admin", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.settingController.getSettingForAdmin.bind(this.settingController));
        router.get("/", this.settingController.getSetting.bind(this.settingController));
        router.put("/", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), upload_1.upload.fields([
            {
                name: "headerLogo",
                maxCount: 1,
            },
            {
                name: "footerLogo",
                maxCount: 1,
            },
        ]), (0, upload_1.processImagesMiddleware)(["footerLogo", "headerLogo"]), this.settingController.updateSetting.bind(this.settingController));
        return router;
    }
}
exports.SettingRouter = SettingRouter;
