"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const list_1 = require("./provider/list");
const list_2 = require("./user/list");
const create_order_1 = require("./user/create-order");
const create_installments_order_1 = require("./user/create-installments-order");
const list_installments_order_1 = require("./user/list-installments-order");
const pay_installments_1 = require("./user/pay-installments");
const get_installments_order_1 = require("./user/get-installments-order");
const list_3 = require("./admin/list");
const update_shipping_status_1 = require("./admin/update-shipping-status");
const list_installments_order_2 = require("./provider/list-installments-order");
const installments_order_update_1 = require("./provider/installments-order-update");
const get_installments_order_2 = require("./provider/get-installments-order");
const cancel_installments_order_1 = require("./provider/cancel-installments-order");
class OrderService {
    constructor(productService, paymentService, cartService, addressService, earningService) {
        this.productService = productService;
        this.paymentService = paymentService;
        this.cartService = cartService;
        this.addressService = addressService;
        this.earningService = earningService;
        // admin
        this.listForAdminLogic = new list_3.ListForAdminLogic();
        this.updateShippingStatusLogic = new update_shipping_status_1.UpdateShippingStatusLogic(this.earningService);
        // user
        this.listForUserLogic = new list_2.ListForUserLogic();
        this.createOrderLogic = new create_order_1.CreateOrderLogic();
        this.createInstallmentsOrderLogic = new create_installments_order_1.CreateInstallmentsOrderLogic(this.productService, this.addressService);
        this.listInstallmentsOrderForUserLogic =
            new list_installments_order_1.ListInstallmentsOrderForUserLogic();
        this.payInstallmentsLogic = new pay_installments_1.PayInstallmentsLogic();
        this.getInstallmentsOrderForUserLogic =
            new get_installments_order_1.GetInstallmentsOrderForUserLogic();
        // provider
        this.listForProviderLogic = new list_1.ListForProviderLogic();
        this.listInstallmentsOrderForProviderLogic =
            new list_installments_order_2.ListInstallmentsOrderForProviderLogic();
        this.installmentsOrderUpdateLogic = new installments_order_update_1.InstallmentsOrderUpdateLogic(this.productService);
        this.getInstallmentsOrderForProviderLogic =
            new get_installments_order_2.GetInstallmentsOrderForProviderLogic();
        this.cancelInstallmentsOrderLogic = new cancel_installments_order_1.CancelInstallmentsOrderLogic(this.productService);
    }
    listForAdmin(pagination, query, language) {
        return this.listForAdminLogic.execute({ pagination, query }, language);
    }
    updateShippingStatus(orderId, data, language) {
        return this.updateShippingStatusLogic.update({ orderId, ...data }, language);
    }
    listForUser(user, pagination, query, language) {
        return this.listForUserLogic.list({ user, query, pagination }, language);
    }
    listForProvider(provider, pagination, query, language) {
        return this.listForProviderLogic.list({ provider, query, pagination }, language);
    }
    createOrder(user, data) {
        return this.createOrderLogic.create({ user, ...data });
    }
    createInstallmentsOrder(user, data, language) {
        return this.createInstallmentsOrderLogic.execute({ user, ...data }, language);
    }
    listInstallmentsOrderForProvider(provider, pagination, query, language) {
        return this.listInstallmentsOrderForProviderLogic.list({ provider, query, pagination }, language);
    }
    updateInstallmentsOrder(provider, id, body, language) {
        return this.installmentsOrderUpdateLogic.update({ provider, id, ...body }, language);
    }
    getInstallmentsOrder(provider, id, language) {
        return this.getInstallmentsOrderForProviderLogic.execute({ provider, id }, language);
    }
    listInstallmentsOrderForUser(user, pagination, query, language) {
        return this.listInstallmentsOrderForUserLogic.list({ user, query, pagination }, language);
    }
    payInstallments(user, data, language) {
        return this.payInstallmentsLogic.execute({ user, ...data });
    }
    getInstallmentsOrderForUser(user, orderId, language) {
        return this.getInstallmentsOrderForUserLogic.execute({ user, orderId }, language);
    }
    cancelInstallmentsOrder(provider, id) {
        return this.cancelInstallmentsOrderLogic.execute({
            provider,
            id,
        });
    }
}
exports.OrderService = OrderService;
