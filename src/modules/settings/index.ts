import { SettingService } from "./settings.service";
import { SettingRouter } from "./settings.router";

export class SettingModule {
  settingService: SettingService;
  settingRouter: SettingRouter;

  constructor() {
    this.settingService = new SettingService();
    this.settingRouter = new SettingRouter(this.settingService);
  }

  routerFactory() {
    return this.settingRouter.createRouter();
  }
}
