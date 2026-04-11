import { Router } from "express";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import {
  UserAuthMiddleware,
  ProviderAuthMiddleware,
  AdminAuthMiddleware,
} from "../../shared/middlewares/auth";

import paginationMiddleware from "../../shared/middlewares/pagination";

import { upload, processUpload } from "../../shared/middlewares/upload";

export class OrderRouter {
  private orderController: OrderController;

  private userAuthMiddleware: UserAuthMiddleware;
  private providerAuthMiddleware: ProviderAuthMiddleware;
  private adminAuthMiddleware: AdminAuthMiddleware;

  constructor(public orderService: OrderService) {
    this.orderController = new OrderController(this.orderService);
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.providerAuthMiddleware = new ProviderAuthMiddleware();
    this.adminAuthMiddleware = new AdminAuthMiddleware();
  }

  createRouter() {
    const router = Router();


    /**
     * @openapi
     * /api/orders:
     *   post:
     *     tags: [Orders]
     *     summary: POST /
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.orderController.createOrders.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/installments:
     *   post:
     *     tags: [Orders]
     *     summary: POST /installments
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/installments",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      upload.fields([
        {
          name: "accountStatement",
          maxCount: 1,
        },
        {
          name: "salaryCertificate",
          maxCount: 1,
        },
        {
          name: "contract",
          maxCount: 1,
        },
      ]),
      processUpload(["accountStatement", "salaryCertificate", "contract"]),
      this.orderController.createInstallmentsOrder.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/user:
     *   get:
     *     tags: [Orders]
     *     summary: GET /user
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/user",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      paginationMiddleware,
      this.orderController.listForUser.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/user/installments:
     *   get:
     *     tags: [Orders]
     *     summary: GET /user/installments
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/user/installments",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      paginationMiddleware,
      this.orderController.listInstallmentsOrderForUser.bind(
        this.orderController
      )
    );


    /**
     * @openapi
     * /api/orders/user/installments/:id:
     *   get:
     *     tags: [Orders]
     *     summary: GET /user/installments/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/user/installments/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.orderController.getInstallmentsOrderForUser.bind(
        this.orderController
      )
    );


    /**
     * @openapi
     * /api/orders/user/installments/pay:
     *   post:
     *     tags: [Orders]
     *     summary: POST /user/installments/pay
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/user/installments/pay",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.orderController.payInstallments.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/provider:
     *   get:
     *     tags: [Orders]
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
      this.orderController.listForProvider.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/admin:
     *   get:
     *     tags: [Orders]
     *     summary: GET /admin
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/admin",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      paginationMiddleware,
      this.orderController.listForAdmin.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/admin/:id:
     *   patch:
     *     tags: [Orders]
     *     summary: PATCH /admin/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.patch(
      "/admin/:id",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.orderController.updateShippingStatus.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/provider/installments:
     *   get:
     *     tags: [Orders]
     *     summary: GET /provider/installments
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/provider/installments",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      paginationMiddleware,
      this.orderController.listInstallmentsOrderForProvider.bind(
        this.orderController
      )
    );


    /**
     * @openapi
     * /api/orders/provider/installments/:id:
     *   get:
     *     tags: [Orders]
     *     summary: GET /provider/installments/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/provider/installments/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.orderController.getInstallmentsOrder.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/provider/installments/:id:
     *   patch:
     *     tags: [Orders]
     *     summary: PATCH /provider/installments/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.patch(
      "/provider/installments/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.orderController.updateInstallmentsOrder.bind(this.orderController)
    );


    /**
     * @openapi
     * /api/orders/provider/installments/:id:
     *   delete:
     *     tags: [Orders]
     *     summary: DELETE /provider/installments/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      "/provider/installments/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.orderController.cancelInstallmentsOrder.bind(this.orderController)
    );

    return router;
  }
}
