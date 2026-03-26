"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const agenda_1 = __importDefault(require("../../shared/scheduler/agenda"));
const order_router_1 = require("./order.router");
const order_service_1 = require("./order.service");
const cancelOrderJob_1 = require("./jobs/cancelOrderJob");
const cancelInstallmentsOderJob_1 = require("./jobs/cancelInstallmentsOderJob");
class OrderModule {
    constructor(productService, cartService, paymentService, addressService, earningService) {
        this.productService = productService;
        this.cartService = cartService;
        this.paymentService = paymentService;
        this.addressService = addressService;
        this.earningService = earningService;
        this.orderService = new order_service_1.OrderService(this.productService, this.paymentService, this.cartService, this.addressService, this.earningService);
        this.orderRouter = new order_router_1.OrderRouter(this.orderService);
        this.cancelOrderJob = new cancelOrderJob_1.CancelOrderJob(this.cartService, this.productService, this.paymentService);
        this.cancelInstallmentsOrderJob = new cancelInstallmentsOderJob_1.CancelInstallmentsOrderJob(this.paymentService);
        this.registerJobs();
    }
    registerJobs() {
        agenda_1.default.define(cancelOrderJob_1.JOB_NAME, async (job) => {
            const { transaction } = job.attrs.data;
            if (!transaction) {
                console.error("Transaction ID is missing.");
                return;
            }
            try {
                await this.cancelOrderJob.cancelLogic(transaction);
                console.log(`✅ Order cancellation job executed for transaction: ${transaction}`);
            }
            catch (error) {
                console.error(`❌ Failed to cancel order for transaction ${transaction}:`, error);
            }
        });
        agenda_1.default.define(cancelInstallmentsOderJob_1.JOB_NAME, async (job) => {
            const { transaction } = job.attrs.data;
            if (!transaction) {
                console.error("Transaction ID is missing.");
                return;
            }
            try {
                await this.cancelInstallmentsOrderJob.cancelLogic(transaction);
                console.log(`✅ Installments order cancellation job executed for transaction: ${transaction}`);
            }
            catch (error) {
                console.error(`❌ Failed to cancel installments order for transaction ${transaction}:`, error);
            }
        });
    }
    routerFactory() {
        return this.orderRouter.createRouter();
    }
}
exports.OrderModule = OrderModule;
