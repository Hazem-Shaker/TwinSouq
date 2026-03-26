"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRouter = void 0;
const express_1 = require("express");
const provider_controller_1 = require("./provider.controller");
const auth_1 = require("../../shared/middlewares/auth");
const pagination_1 = __importDefault(require("../../shared/middlewares/pagination"));
const upload_1 = require("../../shared/middlewares/upload");
class ProviderRouter {
    constructor(providerService) {
        this.providerService = providerService;
        this.providerController = new provider_controller_1.ProviderController(this.providerService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
        this.adminAuthMiddleware = new auth_1.AdminAuthMiddleware();
        this.providerAuthMiddleware = new auth_1.ProviderAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.post("/requests", this.userAuthMiddleware.authenticateWithProviderRole.bind(this.userAuthMiddleware), upload_1.upload.fields([
            {
                name: "photo",
                maxCount: 1,
            },
            {
                name: "idImageFront",
                maxCount: 1,
            },
            {
                name: "idImageBack",
                maxCount: 1,
            },
        ]), (0, upload_1.processImagesMiddleware)(["photo", "idImageFront", "idImageBack"]), this.providerController.createProviderRequest.bind(this.providerController));
        router.get("/requests", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), pagination_1.default, this.providerController.listProviderRequests.bind(this.providerController));
        router.get("/requests/:providerRequestId", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.providerController.getProviderRequest.bind(this.providerController));
        router.post("/requests/:providerRequestId/accept", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.providerController.acceptProviderRequest.bind(this.providerController));
        router.delete("/requests/:providerRequestId/reject", this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware), this.providerController.rejectProviderRequest.bind(this.providerController));
        router.get("/stats", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.providerController.getProviderStats.bind(this.providerController));
        router.get("/home-page", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.providerController.getProviderHomePage.bind(this.providerController));
        return router;
    }
}
exports.ProviderRouter = ProviderRouter;
