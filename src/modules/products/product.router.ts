import { Router } from "express";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProviderAuthMiddleware } from "../../shared/middlewares/auth";
import { CheckUser } from "../../shared/middlewares/check-user";
import pagination from "../../shared/middlewares/pagination";
import {
  processImagesMiddleware,
  upload,
  productUpload,
} from "../../shared/middlewares/upload";
import paginationMiddleware from "../../shared/middlewares/pagination";

export class ProductRouter {
  productService: ProductService;
  private productController: ProductController;
  private providerAuthMiddleware: ProviderAuthMiddleware;
  private checkUser: CheckUser;

  constructor(productService: ProductService) {
    this.productService = productService;
    this.productController = new ProductController(this.productService);
    this.providerAuthMiddleware = new ProviderAuthMiddleware();
    this.checkUser = new CheckUser();
  }

  createRouter() {
    const router = Router();

    router.post(
      "/provider",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      upload.any(),
      productUpload,
      this.productController.createProduct.bind(this.productController)
    );

    router.get(
      "/provider",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      paginationMiddleware,
      this.productController.listProductsForProvider.bind(
        this.productController
      )
    );

    router.get(
      "/provider/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.productController.getProductForProvider.bind(this.productController)
    );

    router.delete(
      "/provider/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.productController.deleteProduct.bind(this.productController)
    );

    router.patch(
      "/provider/:id/publish",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.productController.publishProduct.bind(this.productController)
    );

    router.get(
      "/provider/:id/variants",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      paginationMiddleware,
      this.productController.listProductVariants.bind(this.productController)
    );

    router.post(
      "/provider/:id/variants",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      upload.fields([
        {
          name: "images",
          maxCount: 6,
        },
      ]),
      processImagesMiddleware(["images"]),
      this.productController.createProductVariant.bind(this.productController)
    );

    router.put(
      "/provider/:id/variants/:variantId",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      upload.fields([
        {
          name: "images",
          maxCount: 6,
        },
      ]),
      processImagesMiddleware(["images"]),
      this.productController.updateProductVariant.bind(this.productController)
    );

    router.put(
      "/provider/:productId",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      upload.any(),
      productUpload,
      this.productController.updateProduct.bind(this.productController)
    );

    router.get(
      "/",
      this.checkUser.check.bind(this.checkUser),
      pagination,
      this.productController.listProducts.bind(this.productController)
    );

    router.get(
      "/:id",
      this.checkUser.check.bind(this.checkUser),
      this.productController.getProduct.bind(this.productController)
    );

    return router;
  }
}
