"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderModule = void 0;
const provider_router_1 = require("./provider.router");
const provider_service_1 = require("./provider.service");
class ProviderModule {
    constructor(fileService) {
        this.fileService = fileService;
        this.providerService = new provider_service_1.ProviderService(this.fileService);
        this.providerRouter = new provider_router_1.ProviderRouter(this.providerService);
    }
    routerFactory() {
        return this.providerRouter.createRouter();
    }
}
exports.ProviderModule = ProviderModule;
