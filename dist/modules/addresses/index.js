"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressModule = void 0;
const address_service_1 = require("./address.service");
const address_router_1 = require("./address.router");
class AddressModule {
    constructor() {
        this.addressService = new address_service_1.AddressService();
        this.addressRouter = new address_router_1.AddressRouter(this.addressService);
    }
    routerFactory() {
        return this.addressRouter.createRouter();
    }
}
exports.AddressModule = AddressModule;
