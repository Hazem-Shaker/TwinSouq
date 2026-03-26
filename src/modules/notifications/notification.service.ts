import { GetTokenLogic } from "./get-token";
import { SendNotificationLogic } from "./send-notification";
export class NotificationService {
  private getTokenLogic: GetTokenLogic;
  private sendNotificationLogic: SendNotificationLogic;
  constructor() {
    this.getTokenLogic = new GetTokenLogic();
    this.sendNotificationLogic = new SendNotificationLogic();
  }

  getToken(userId: any, type: any) {
    return this.getTokenLogic.getToken({ userId, type });
  }

  sendNotification(type: string, data: any) {
    return this.sendNotificationLogic.execute({ type, ...data });
  }
}
