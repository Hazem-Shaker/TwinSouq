"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const update_1 = require("./update");
const get_for_admin_1 = require("./get-for-admin");
const get_1 = require("./get");
class SettingService {
    constructor() {
        this.getForAdminLogic = new get_for_admin_1.GetForAdminLogic();
        this.getLogic = new get_1.GetLogic();
        this.updateLogic = new update_1.UpdateLogic(this.getForAdminLogic);
    }
    updateSetting(data, language) {
        return this.updateLogic.update(data, language);
    }
    getSetting(language) {
        return this.getLogic.get(language);
    }
    getSettingForAdmin(language) {
        return this.getForAdminLogic.get(language);
    }
}
exports.SettingService = SettingService;
