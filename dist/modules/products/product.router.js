"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_1 = require("../../shared/middlewares/auth");
const check_user_1 = require("../../shared/middlewares/check-user");
const pagination_1 = __importDefault(require("../../shared/middlewares/pagination"));
const upload_1 = require("../../shared/middlewares/upload");
const pagination_2 = __importDefault(require("../../shared/middlewares/pagination"));
class ProductRouter {
    constructor(productService) {
        this.productService = productService;
        this.productController = new product_controller_1.ProductController(this.productService);
        this.providerAuthMiddleware = new auth_1.ProviderAuthMiddleware();
        this.checkUser = new check_user_1.CheckUser();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.post("/provider", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), upload_1.upload.any(), upload_1.productUpload, this.productController.createProduct.bind(this.productController));
        router.get("/provider", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), pagination_2.default, this.productController.listProductsForProvider.bind(this.productController));
        router.get("/provider/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.productController.getProductForProvider.bind(this.productController));
        router.delete("/provider/:id", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.productController.deleteProduct.bind(this.productController));
        router.patch("/provider/:id/publish", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), this.productController.publishProduct.bind(this.productController));
        router.get("/provider/:id/variants", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), pagination_2.default, this.productController.listProductVariants.bind(this.productController));
        router.post("/provider/:id/variants", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), upload_1.upload.fields([
            {
                name: "images",
                maxCount: 6,
            },
        ]), (0, upload_1.processImagesMiddleware)(["images"]), this.productController.createProductVariant.bind(this.productController));
        router.put("/provider/:id/variants/:variantId", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), upload_1.upload.fields([
            {
                name: "images",
                maxCount: 6,
            },
        ]), (0, upload_1.processImagesMiddleware)(["images"]), this.productController.updateProductVariant.bind(this.productController));
        router.put("/provider/:productId", this.providerAuthMiddleware.authenticate.bind(this.providerAuthMiddleware), upload_1.upload.any(), upload_1.productUpload, this.productController.updateProduct.bind(this.productController));
        router.get("/", this.checkUser.check.bind(this.checkUser), pagination_1.default, this.productController.listProducts.bind(this.productController));
        router.get("/:id", this.checkUser.check.bind(this.checkUser), this.productController.getProduct.bind(this.productController));
        return router;
    }
}
exports.ProductRouter = ProductRouter;
