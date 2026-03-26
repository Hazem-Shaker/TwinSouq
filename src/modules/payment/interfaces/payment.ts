export interface PayoutRequest {
  amount: number;
  currency: string;
  iban?: string;
  bankName?: string;
  swiftCode?: string;
  walletId?: string; // For mobile wallets
  additionalData?: Record<string, any>; // For any other gateway-specific fields
}

export interface IPaymentGateway {
  initialize(): Promise<void>;
  charge(amount: number, currency: string, customerId: string): Promise<any>;
  refund(transactionId: string, amount: number): Promise<boolean>;
  getTransactionStatus(transactionId: string): Promise<string>;

  // Updated payout function
  sendPayout(
    payoutRequest: PayoutRequest
  ): Promise<{ success: boolean; transactionId?: string; error?: string }>;
}
