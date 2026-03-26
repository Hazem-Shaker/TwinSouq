"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelOrderJob = exports.JOB_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = __importDefault(require("../order.model"));
exports.JOB_NAME = "ORDERS_NO_PAYMENT_RESPONSE";
class CancelOrderJob {
    constructor(cartService, productService, paymentService) {
        this.cartService = cartService;
        this.productService = productService;
        this.paymentService = paymentService;
    }
    async cancelLogic(transaction) {
        const id = new mongoose_1.default.Types.ObjectId(transaction);
        const notProcessed = await this.paymentService.noRespondGateway(id);
        if (!notProcessed) {
            return;
        }
        const orders = await order_model_1.default.find({
            transaction: id,
        });
        const variantIds = [];
        for (let order of orders) {
            for (let product of order.products) {
                variantIds.push({
                    variant: product.variant,
                    quantity: product.quantity,
                });
            }
        }
        await this.cartService.makeCartFree(orders[0]?.user);
        await this.productService.rollbackStock(variantIds);
        await order_model_1.default.updateMany({
            transaction,
        }, {
            paymentStatus: "failed",
        });
    }
}
exports.CancelOrderJob = CancelOrderJob;
