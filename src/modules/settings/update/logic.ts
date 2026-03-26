import { inputSchema, Input } from "./input";
import Setting from "../settings.model";
import { config } from "../../../shared/config";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import { ISettingResponseData } from "../types";
import { CreateLogic } from "../create";
import { GetForAdminLogic } from "../get-for-admin";
export class UpdateLogic {
  constructor(public getLogic: GetForAdminLogic) {}
  async update(settings: Input, language: string = "en") {
    settings = inputSchema.parse(settings);
    const exitsSettings = await Setting.findOne({});
    if (!exitsSettings) {
      await Setting.create({});
    }

    await Setting.findOneAndUpdate(
      {},
      {
        ...settings,
        headerLogo: settings.headerLogo[0]._id,
        footerLogo: settings.footerLogo[0]._id,
      }
    );

    const response = await this.getLogic.get();
    return response;
  }
}
