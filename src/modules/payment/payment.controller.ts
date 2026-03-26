import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  constructor(public paymentService: PaymentService) {}
}
