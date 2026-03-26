"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async listForAdmin(req, res, next) {
        try {
            const response = await this.orderService.listForAdmin(req.pagination, req.query, req.language);
            res.sendSuccess(req.t("orders.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async updateShippingStatus(req, res, next) {
        try {
            const response = await this.orderService.updateShippingStatus(req.params.id, req.body, req.language);
            res.sendSuccess(req.t("order.updated"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async listForUser(req, res, next) {
        try {
            const response = await this.orderService.listForUser(req.user.id, req.pagination, req.query, req.language);
            res.sendSuccess(req.t("orders.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async listForProvider(req, res, next) {
        try {
            const response = await this.orderService.listForProvider(req.user.providerId, req.pagination, req.query, req.language);
            res.sendSuccess(req.t("orders.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async createOrders(req, res, next) {
        try {
            const response = await this.orderService.createOrder(req.user.id, req.body);
            res.sendSuccess(req.t("order.created"), response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async createInstallmentsOrder(req, res, next) {
        try {
            const response = await this.orderService.createInstallmentsOrder(req.user.id, req.body, req.language);
            res.sendSuccess(req.t("order.created"), response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async listInstallmentsOrderForProvider(req, res, next) {
        try {
            const response = await this.orderService.listInstallmentsOrderForProvider(req.user.providerId, req.pagination, req.query, req.language);
            res.sendSuccess(req.t("orders.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async updateInstallmentsOrder(req, res, next) {
        try {
            const response = await this.orderService.updateInstallmentsOrder(req.user.providerId, req.params.id, req.body, req.language);
            res.sendSuccess(req.t("order.updated"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getInstallmentsOrder(req, res, next) {
        try {
            const response = await this.orderService.getInstallmentsOrder(req.user.providerId, req.params.id, req.language);
            res.sendSuccess(req.t("order.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async listInstallmentsOrderForUser(req, res, next) {
        try {
            const response = await this.orderService.listInstallmentsOrderForUser(req.user.id, req.pagination, req.query, req.language);
            res.sendSuccess(req.t("orders.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async payInstallments(req, res, next) {
        try {
            const response = await this.orderService.payInstallments(req.user.id, req.body, req.language);
            res.sendSuccess(req.t("order.updated"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getInstallmentsOrderForUser(req, res, next) {
        try {
            const response = await this.orderService.getInstallmentsOrderForUser(req.user.id, req.params.id, req.language);
            res.sendSuccess(req.t("order.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async cancelInstallmentsOrder(req, res, next) {
        try {
            const provider = req.user.providerId;
            const { id } = req.params;
            const response = await this.orderService.cancelInstallmentsOrder(provider, id);
            res.sendSuccess(req.t("order.cancelled"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
