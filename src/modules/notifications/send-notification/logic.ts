import mongoose from "mongoose";
import Notification from "../notification.model";
import { sendNotificationToInterest, sendNotificationToUsers } from "../utils";
import { SendNotificationInput, sendNotificationInputSchema } from "./input";
import { ValidationError } from "../../../shared/utils/custom-errors";
export class SendNotificationLogic {
  constructor() {}

  async execute(input: SendNotificationInput) {
    const { type, target, title_ar, title_en, body_ar, body_en, data, app } =
      sendNotificationInputSchema.parse(input);

    const { type: targetType, id } = target;

    switch (targetType) {
      case "user":
        return this.sendToUser(id as mongoose.Schema.Types.ObjectId, {
          type,
          title_ar,
          title_en,
          body_ar,
          body_en,
          data,
          app,
        });
      case "interest":
        return this.sendToInterest(id as "users" | "vendors" | "customers", {
          type,
          title_ar,
          title_en,
          body_ar,
          body_en,
          data,
          app,
        });
      default:
        throw new ValidationError("wrong_target_type");
    }
  }

  async sendToUser(
    id: mongoose.Schema.Types.ObjectId,
    {
      type,
      app,
      title_ar,
      title_en,
      body_ar,
      body_en,
      data,
    }: {
      type: string;
      title_ar: string;
      title_en: string;
      body_ar: string;
      body_en: string;
      data: any;
      app: string;
    }
  ) {
    const notificationData = {
      target: "user",
      app,
      user: id,
      title_ar,
      title_en,
      message_ar: body_ar,
      message_en: body_en,
      type,
      data,
    };
    const notification = new Notification(notificationData);
    await notification.save();

    await sendNotificationToUsers(
      [`${app === "both" ? "user" : app}-${id.toString()}`],
      { ar: title_ar, en: title_en },
      { ar: body_ar, en: body_en },
      data
    );

    return notification;
  }

  async sendToInterest(
    interest: "users" | "vendors" | "customers",
    {
      type,
      title_ar,
      title_en,
      body_ar,
      body_en,
      data,
      app,
    }: {
      type: string;
      title_ar: string;
      title_en: string;
      body_ar: string;
      body_en: string;
      data: any;
      app: string;
    }
  ) {
    const notificationData = {
      target: "interest",
      title_ar,
      title_en,
      body_ar,
      body_en,
      data,
      app,
    };
    const notification = new Notification(notificationData);
    await notification.save();
    await sendNotificationToInterest(
      interest,
      { ar: title_ar, en: title_en },
      { ar: body_ar, en: body_en },
      data
    );

    return notification;
  }
}
