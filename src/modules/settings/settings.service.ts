import { UpdateLogic } from "./update";
import { GetForAdminLogic } from "./get-for-admin";
import { GetLogic } from "./get";

export class SettingService {
  updateLogic: UpdateLogic;
  getForAdminLogic: GetForAdminLogic;
  getLogic: GetLogic;

  constructor() {
    this.getForAdminLogic = new GetForAdminLogic();
    this.getLogic = new GetLogic();
    this.updateLogic = new UpdateLogic(this.getForAdminLogic);
  }

  updateSetting(data: any, language: string) {
    return this.updateLogic.update(data, language);
  }

  getSetting(language: string) {
    return this.getLogic.get(language);
  }

  getSettingForAdmin(language: string) {
    return this.getForAdminLogic.get(language);
  }
}
