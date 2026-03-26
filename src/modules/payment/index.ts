import { PaymentService } from "./payment.service";
import { PaymentRouter } from "./payment.router";

export class PaymentModule {
  paymentService: PaymentService;
  paymentRouter: PaymentRouter;
  constructor() {
    this.paymentService = new PaymentService();
    this.paymentRouter = new PaymentRouter(this.paymentService);
  }

  routerFactory() {
    return this.paymentRouter.createRouter();
  }
}
