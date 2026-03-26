import { SettingService } from "./settings.service";
import { Request, Response, NextFunction } from "express";

export class SettingController {
  private settingService: SettingService;
  constructor(settingService: SettingService) {
    this.settingService = settingService;
  }

  async getSettingForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.settingService.getSettingForAdmin(
        req.language
      );
      res.sendSuccess(req.t("settings.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.settingService.getSetting(req.language);
      res.sendSuccess(req.t("settings.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.settingService.updateSetting(
        req.body,
        req.language
      );
      res.sendSuccess(req.t("settings.updated"), response, 200);
    } catch (error) {
      next(error);
    }
  }
}
