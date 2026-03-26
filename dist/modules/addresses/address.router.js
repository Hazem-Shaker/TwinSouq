"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../shared/middlewares/auth");
const address_controller_1 = require("./address.controller");
class AddressRouter {
    constructor(addressService) {
        this.addressService = addressService;
        this.addressController = new address_controller_1.AddressController(this.addressService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
        this.providerAuthMiddleware = new auth_1.ProviderAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        // Create Address
        router.post("/user", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.addressController.createForUser.bind(this.addressController));
        router.post("/provider", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.addressController.createForProvider.bind(this.addressController));
        // Update Address
        router.put("/user/:id", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.addressController.updateForUser.bind(this.addressController));
        router.put("/provider/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.addressController.updateForProvider.bind(this.addressController));
        // List Addresses
        router.get("/user", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.addressController.listForUser.bind(this.addressController));
        router.get("/provider", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.addressController.listForProvider.bind(this.addressController));
        // Get Address by ID
        router.get("/user/:id", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.addressController.getForUser.bind(this.addressController));
        router.get("/provider/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.addressController.getForProvider.bind(this.addressController));
        // Delete Address
        router.delete("/user/:id", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.addressController.deleteForUser.bind(this.addressController));
        router.delete("/provider/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.addressController.deleteForProvider.bind(this.addressController));
        return router;
    }
}
exports.AddressRouter = AddressRouter;
