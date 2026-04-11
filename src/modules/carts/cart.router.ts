import { Router } from "express";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";

export class CartRouter {
  private cartController: CartController;
  private userAuthMiddleware: UserAuthMiddleware;
  constructor(public cartService: CartService) {
    this.cartController = new CartController(this.cartService);
    this.userAuthMiddleware = new UserAuthMiddleware();
  }

  createRouter() {
    const router = Router();


    /**
     * @openapi
     * /api/carts:
     *   put:
     *     tags: [Carts]
     *     summary: PUT /
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.cartController.addProductToCart.bind(this.cartController)
    );


    /**
     * @openapi
     * /api/carts:
     *   get:
     *     tags: [Carts]
     *     summary: GET /
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.cartController.getCart.bind(this.cartController)
    );


    /**
     * @openapi
     * /api/carts/installment:
     *   get:
     *     tags: [Carts]
     *     summary: GET /installment
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/installment",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.cartController.getInstallmentCart.bind(this.cartController)
    );


    /**
     * @openapi
     * /api/carts/installment/:product:
     *   delete:
     *     tags: [Carts]
     *     summary: DELETE /installment/:product
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      "/installment/:product",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.cartController.removeFromInstallmentCart.bind(this.cartController)
    );


    /**
     * @openapi
     * /api/carts/installment:
     *   put:
     *     tags: [Carts]
     *     summary: PUT /installment
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      "/installment",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.cartController.addToInstallmentCart.bind(this.cartController)
    );

    return router;
  }
}
