"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstallmentsOrderStatusLogic = void 0;
const installmentsOrder_model_1 = __importDefault(require("../../installmentsOrder/installmentsOrder.model"));
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const input_1 = require("./input");
const mongoose_1 = __importDefault(require("mongoose"));
class UpdateInstallmentsOrderStatusLogic {
    constructor(earningService) {
        this.earningService = earningService;
    }
    async update(input, language = "en") {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const { orderId, shippingStatus } = input_1.inputSchema.parse(input);
            const order = await installmentsOrder_model_1.default.findById(orderId);
            if (!order) {
                throw new custom_errors_1.NotFoundError("order_not_found");
            }
            if (order.shippingStatus === "delivered") {
                throw new custom_errors_1.ConflictError("order_already_delivered");
            }
            if (shippingStatus === "delivered") {
                for (const installment of order.paidInstallments) {
                    const profitAmount = (order.price * order.profitPercent) / 100.0;
                    await this.earningService.createInstallmentEarning({
                        provider: order.provider,
                        amount: installment.amount - profitAmount,
                        order: orderId,
                        product: {
                            id: order.product,
                            variant: order.variant,
                            price: order.price,
                            profitPercent: order.profitPercent,
                        },
                        status: "pending",
                    }, session);
                }
            }
            await installmentsOrder_model_1.default.findByIdAndUpdate(orderId, { shippingStatus }, { new: true });
            await session.commitTransaction();
            return null;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
}
exports.UpdateInstallmentsOrderStatusLogic = UpdateInstallmentsOrderStatusLogic;
