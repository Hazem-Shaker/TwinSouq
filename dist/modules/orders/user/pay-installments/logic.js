"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayInstallmentsLogic = void 0;
const installmentsOrder_model_1 = __importDefault(require("../../installmentsOrder/installmentsOrder.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
class PayInstallmentsLogic {
    async execute(input) {
        const { user, installmentsOrderId } = input_1.inputSchema.parse(input);
        const installmentsOder = await installmentsOrder_model_1.default.findOne({
            _id: installmentsOrderId,
            user,
        });
        if (!installmentsOder) {
            throw new custom_errors_1.NotFoundError("installments_order_not_found");
        }
        if (installmentsOder.status !== "approved") {
            throw new custom_errors_1.BadRequestError("installments_order_not_approved");
        }
        if (installmentsOder.donePayments === installmentsOder.numberOfMonths + 1) {
            throw new custom_errors_1.BadRequestError("order_paid");
        }
        if (installmentsOder.transactionId) {
            throw new custom_errors_1.BadRequestError("order_in_transaction");
        }
        throw new custom_errors_1.BadRequestError("online_payment_not_configured");
    }
}
exports.PayInstallmentsLogic = PayInstallmentsLogic;
