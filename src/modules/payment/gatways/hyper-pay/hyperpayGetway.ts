// src/modules/payment/gateways/HyperPayGateway.ts
import axios from "axios";
import { IPaymentGateway, PayoutRequest } from "../../interfaces";

export class HyperPayGateway implements IPaymentGateway {
  private apiKey: string;
  private entityId: string;

  constructor(apiKey: string, entityId: string) {
    this.apiKey = apiKey;
    this.entityId = entityId;
  }

  async initialize() {
    console.log("HyperPay initialized");
  }

  async charge(amount: number, currency: string, customerId: string) {
    return { transactionId: "hyperpay_txn_123", status: "success" };
  }

  async refund(transactionId: string, amount: number) {
    return true;
  }

  async getTransactionStatus(transactionId: string) {
    return "completed";
  }

  async sendPayout(payoutRequest: PayoutRequest) {
    if (!payoutRequest.iban) {
      return { success: false, error: "IBAN is required for HyperPay payouts" };
    }

    try {
      const response = await axios.post(
        "https://test.oppwa.com/v1/payouts",
        {
          entityId: this.entityId,
          amount: payoutRequest.amount.toFixed(2),
          currency: payoutRequest.currency,
          paymentType: "DB",
          bankAccount: { iban: payoutRequest.iban },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.result.code === "000.100.110") {
        return { success: true, transactionId: response.data.id };
      } else {
        return { success: false, error: response.data.result.description };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
