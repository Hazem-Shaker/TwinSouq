import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";

export class PaymentRouter {
  private paymentController: PaymentController;
  private userAuthMiddleware: UserAuthMiddleware;
  constructor(public paymentService: PaymentService) {
    this.paymentController = new PaymentController(this.paymentService);
    this.userAuthMiddleware = new UserAuthMiddleware();
  }

  createRouter() {
    const router = Router();

    return router;
  }
}
