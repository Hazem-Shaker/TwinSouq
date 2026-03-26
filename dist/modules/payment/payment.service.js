"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const paymentTransaction_model_1 = require("./models/paymentTransaction.model");
class PaymentService {
    constructor() { }
    async noRespondGateway(id) {
        const transaction = await paymentTransaction_model_1.PaymentTransaction.findById(id);
        if (!transaction) {
            return false;
        }
        if (transaction.status !== "pending") {
            return false;
        }
        transaction.status = "no-respond";
        await transaction.save();
        return true;
    }
}
exports.PaymentService = PaymentService;
