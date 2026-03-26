"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperPayGateway = void 0;
// src/modules/payment/gateways/HyperPayGateway.ts
const axios_1 = __importDefault(require("axios"));
class HyperPayGateway {
    constructor(apiKey, entityId) {
        this.apiKey = apiKey;
        this.entityId = entityId;
    }
    async initialize() {
        console.log("HyperPay initialized");
    }
    async charge(amount, currency, customerId) {
        return { transactionId: "hyperpay_txn_123", status: "success" };
    }
    async refund(transactionId, amount) {
        return true;
    }
    async getTransactionStatus(transactionId) {
        return "completed";
    }
    async sendPayout(payoutRequest) {
        if (!payoutRequest.iban) {
            return { success: false, error: "IBAN is required for HyperPay payouts" };
        }
        try {
            const response = await axios_1.default.post("https://test.oppwa.com/v1/payouts", {
                entityId: this.entityId,
                amount: payoutRequest.amount.toFixed(2),
                currency: payoutRequest.currency,
                paymentType: "DB",
                bankAccount: { iban: payoutRequest.iban },
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data.result.code === "000.100.110") {
                return { success: true, transactionId: response.data.id };
            }
            else {
                return { success: false, error: response.data.result.description };
            }
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
}
exports.HyperPayGateway = HyperPayGateway;
