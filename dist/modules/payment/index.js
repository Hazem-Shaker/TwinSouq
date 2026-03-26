"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const payment_service_1 = require("./payment.service");
const payment_router_1 = require("./payment.router");
class PaymentModule {
    constructor() {
        this.paymentService = new payment_service_1.PaymentService();
        this.paymentRouter = new payment_router_1.PaymentRouter(this.paymentService);
    }
    routerFactory() {
        return this.paymentRouter.createRouter();
    }
}
exports.PaymentModule = PaymentModule;
