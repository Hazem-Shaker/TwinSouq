"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelInstallmentsOrderLogic = void 0;
const input_1 = require("./input");
const installmentsOrder_model_1 = __importDefault(require("../../installmentsOrder/installmentsOrder.model"));
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
class CancelInstallmentsOrderLogic {
    constructor(productService) {
        this.productService = productService;
    }
    async execute(input) {
        const { id, provider } = input_1.inputSchema.parse(input);
        const order = await installmentsOrder_model_1.default.findById(id);
        if (!order || order.provider.toString() !== provider.toString()) {
            throw new custom_errors_1.NoRouteFound("order_not_found");
        }
        if (order.donePayments !== 0) {
            throw new custom_errors_1.BadRequestError("cant_cancel_order");
        }
        if (order.status !== "approved") {
            throw new custom_errors_1.BadRequestError("order_not_approved");
        }
        const session = await installmentsOrder_model_1.default.startSession();
        try {
            await session.withTransaction(async () => {
                await this.productService.rollbackStock([
                    { variant: order.variant, quantity: 1 },
                ]);
                order.status = "rejected";
                await order.save({ session });
            });
        }
        finally {
            await session.endSession();
        }
        return null;
    }
}
exports.CancelInstallmentsOrderLogic = CancelInstallmentsOrderLogic;
