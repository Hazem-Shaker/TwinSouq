"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressController = void 0;
class AddressController {
    constructor(addressService) {
        this.addressService = addressService;
    }
    async createForUser(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.createAddress(user.id, req.body, req.language);
            res.sendSuccess(req.t("address.created"), response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async createForProvider(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.createAddress(user.providerId, req.body, req.language);
            res.sendSuccess(req.t("address.created"), response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async updateForUser(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.updateAddress(req.params.id, user.id, req.body, req.language);
            res.sendSuccess(req.t("address.updated"), response);
        }
        catch (error) {
            next(error);
        }
    }
    async updateForProvider(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.updateAddress(req.params.id, user.providerId, req.body, req.language);
            res.sendSuccess(req.t("address.updated"), response);
        }
        catch (error) {
            next(error);
        }
    }
    async listForUser(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.listAddresses(user.id, req.language);
            res.sendSuccess(req.t("address.listed"), response);
        }
        catch (error) {
            next(error);
        }
    }
    async listForProvider(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.listAddresses(user.providerId, req.language);
            res.sendSuccess(req.t("address.listed"), response);
        }
        catch (error) {
            next(error);
        }
    }
    async getForUser(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.getAddress(req.params.id, user.id, req.language);
            res.sendSuccess(req.t("address.found"), response);
        }
        catch (error) {
            next(error);
        }
    }
    async getForProvider(req, res, next) {
        try {
            const { user } = req;
            const response = await this.addressService.getAddress(req.params.id, user.providerId, req.language);
            res.sendSuccess(req.t("address.found"), response);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteForUser(req, res, next) {
        try {
            const { user } = req;
            await this.addressService.deleteAddress(req.params.id, user.id, req.language);
            res.sendSuccess(req.t("address.deleted"));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteForProvider(req, res, next) {
        try {
            const { user } = req;
            await this.addressService.deleteAddress(req.params.id, user.providerId, req.language);
            res.sendSuccess(req.t("address.deleted"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AddressController = AddressController;
