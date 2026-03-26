"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../shared/middlewares/auth");
class PaymentRouter {
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.paymentController = new payment_controller_1.PaymentController(this.paymentService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        return router;
    }
}
exports.PaymentRouter = PaymentRouter;
