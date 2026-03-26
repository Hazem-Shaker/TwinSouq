"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentsOrderUpdateLogic = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const input_1 = require("./input");
const installmentsOrder_model_1 = __importDefault(require("../../installmentsOrder/installmentsOrder.model"));
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
class InstallmentsOrderUpdateLogic {
    constructor(productService) {
        this.productService = productService;
    }
    async update(input, language = "en") {
        const { id, status, provider } = input_1.inputSchema.parse(input);
        const order = await installmentsOrder_model_1.default.findById(id);
        if (!order) {
            throw new custom_errors_1.NoRouteFound("order_not_found");
        }
        if (order.provider.toString() !== provider.toString()) {
            throw new custom_errors_1.UnauthorizedError("unauthorized");
        }
        if (order.status !== "sent") {
            throw new custom_errors_1.BadRequestError("order_already_updated");
        }
        if (status === "approved") {
            const success = await this.decreaseStock(order.variant);
            if (!success) {
                order.status = "rejected";
                await order.save();
                throw new custom_errors_1.BadRequestError("out_of_stock");
            }
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            order.nextPayment = {
                amount: order.initialPayment,
                date: dueDate,
            };
            order.dueDate = dueDate;
        }
        await order.save();
        order.status = status;
        await order.save();
        return order;
    }
    async decreaseStock(variant) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            await this.productService.decreaseStock([{ variant, quantity: 1 }], session);
            await session.commitTransaction();
            return true;
        }
        catch (error) {
            await session.abortTransaction();
            return false;
        }
        finally {
            await session.endSession();
        }
    }
}
exports.InstallmentsOrderUpdateLogic = InstallmentsOrderUpdateLogic;
