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


    /**
     * @openapi
     * /api/products/provider:
     *   post:
     *     tags: [Products]
     *     summary: POST /provider
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/provider",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      upload.any(),
      productUpload,
      this.productController.createProduct.bind(this.productController)
    );


    /**
     * @openapi
     * /api/products/provider:
     *   get:
     *     tags: [Products]
     *     summary: GET /provider
     *     responses:
     *       200:
     *         description: Success
     */
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


    /**
     * @openapi
     * /api/products/provider/:id:
     *   get:
     *     tags: [Products]
     *     summary: GET /provider/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/provider/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.productController.getProductForProvider.bind(this.productController)
    );


    /**
     * @openapi
     * /api/products/provider/:id:
     *   delete:
     *     tags: [Products]
     *     summary: DELETE /provider/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      "/provider/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.productController.deleteProduct.bind(this.productController)
    );


    /**
     * @openapi
     * /api/products/provider/:id/publish:
     *   patch:
     *     tags: [Products]
     *     summary: PATCH /provider/:id/publish
     *     responses:
     *       200:
     *         description: Success
     */
    router.patch(
      "/provider/:id/publish",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.productController.publishProduct.bind(this.productController)
    );


    /**
     * @openapi
     * /api/products/provider/:id/variants:
     *   get:
     *     tags: [Products]
     *     summary: GET /provider/:id/variants
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/provider/:id/variants",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      paginationMiddleware,
      this.productController.listProductVariants.bind(this.productController)
    );


    /**
     * @openapi
     * /api/products/provider/:id/variants:
     *   post:
     *     tags: [Products]
     *     summary: POST /provider/:id/variants
     *     responses:
     *       200:
     *         description: Success
     */
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


    /**
     * @openapi
     * /api/products/provider/:id/variants/:variantId:
     *   put:
     *     tags: [Products]
     *     summary: PUT /provider/:id/variants/:variantId
     *     responses:
     *       200:
     *         description: Success
     */
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


    /**
     * @openapi
     * /api/products/provider/:productId:
     *   put:
     *     tags: [Products]
     *     summary: PUT /provider/:productId
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      "/provider/:productId",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      upload.any(),
      productUpload,
      this.productController.updateProduct.bind(this.productController)
    );


    /**
     * @openapi
     * /api/products:
     *   get:
     *     tags: [Products]
     *     summary: GET /
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/",
      this.checkUser.check.bind(this.checkUser),
      pagination,
      this.productController.listProducts.bind(this.productController)
    );


    /**
     * @openapi
     * /api/products/:id:
     *   get:
     *     tags: [Products]
     *     summary: GET /:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/:id",
      this.checkUser.check.bind(this.checkUser),
      this.productController.getProduct.bind(this.productController)
    );

    return router;
  }
}
