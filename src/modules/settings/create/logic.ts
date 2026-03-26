import { inputSchema, Input } from './input';
import Setting from "../settings.model";
import { config } from "../../../shared/config";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import { ISettingResponseData } from "../types";

export class CreateLogic {
  async create(): Promise<void> {
    const settings = await Setting.findOne({}) as ISettingResponseData;
    if (!settings) {
      await Setting.create({});
    }
  }
}