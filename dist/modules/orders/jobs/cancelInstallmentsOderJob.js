"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelInstallmentsOrderJob = exports.JOB_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const installmentsOrder_model_1 = __importDefault(require("../installmentsOrder/installmentsOrder.model"));
exports.JOB_NAME = "CANCEL_INSTALLMENTS_ORDER";
class CancelInstallmentsOrderJob {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async cancelLogic(transaction) {
        const id = new mongoose_1.default.Types.ObjectId(transaction);
        const notProcessed = await this.paymentService.noRespondGateway(id);
        if (!notProcessed) {
            return;
        }
        const order = await installmentsOrder_model_1.default.findOne({
            transactionId: id,
        });
        if (!order) {
            return;
        }
        await installmentsOrder_model_1.default.updateOne({
            transactionId: id,
        }, { $unset: { transactionId: 1 } });
    }
}
exports.CancelInstallmentsOrderJob = CancelInstallmentsOrderJob;
