"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../shared/middlewares/auth");
const pagination_1 = __importDefault(require("../../shared/middlewares/pagination"));
const upload_1 = require("../../shared/middlewares/upload");
class OrderRouter {
    constructor(orderService) {
        this.orderService = orderService;
        this.orderController = new order_controller_1.OrderController(this.orderService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
        this.providerAuthMiddleware = new auth_1.ProviderAuthMiddleware();
        this.adminAuthMiddleware = new auth_1.AdminAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.post("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.orderController.createOrders.bind(this.orderController));
        router.post("/installments", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), upload_1.upload.fields([
            {
                name: "accountStatement",
                maxCount: 1,
            },
            {
                name: "salaryCertificate",
                maxCount: 1,
            },
            {
                name: "contract",
                maxCount: 1,
            },
        ]), (0, upload_1.processUpload)(["accountStatement", "salaryCertificate", "contract"]), this.orderController.createInstallmentsOrder.bind(this.orderController));
        router.get("/user", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), pagination_1.default, this.orderController.listForUser.bind(this.orderController));
        router.get("/user/installments", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), pagination_1.default, this.orderController.listInstallmentsOrderForUser.bind(this.orderController));
        router.get("/user/installments/:id", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.orderController.getInstallmentsOrderForUser.bind(this.orderController));
        router.post("/user/installments/pay", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.orderController.payInstallments.bind(this.orderController));
        router.get("/provider", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), pagination_1.default, this.orderController.listForProvider.bind(this.orderController));
        router.get("/admin", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), pagination_1.default, this.orderController.listForAdmin.bind(this.orderController));
        router.patch("/admin/:id", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.orderController.updateShippingStatus.bind(this.orderController));
        router.get("/provider/installments", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), pagination_1.default, this.orderController.listInstallmentsOrderForProvider.bind(this.orderController));
        router.get("/provider/installments/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.orderController.getInstallmentsOrder.bind(this.orderController));
        router.patch("/provider/installments/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.orderController.updateInstallmentsOrder.bind(this.orderController));
        router.delete("/provider/installments/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.orderController.cancelInstallmentsOrder.bind(this.orderController));
        return router;
    }
}
exports.OrderRouter = OrderRouter;
