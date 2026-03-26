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

    router.post(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.orderController.createOrders.bind(this.orderController)
    );

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

    router.get(
      "/user",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      paginationMiddleware,
      this.orderController.listForUser.bind(this.orderController)
    );

    router.get(
      "/user/installments",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      paginationMiddleware,
      this.orderController.listInstallmentsOrderForUser.bind(
        this.orderController
      )
    );

    router.get(
      "/user/installments/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.orderController.getInstallmentsOrderForUser.bind(
        this.orderController
      )
    );

    router.post(
      "/user/installments/pay",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.orderController.payInstallments.bind(this.orderController)
    );

    router.get(
      "/provider",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      paginationMiddleware,
      this.orderController.listForProvider.bind(this.orderController)
    );

    router.get(
      "/admin",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      paginationMiddleware,
      this.orderController.listForAdmin.bind(this.orderController)
    );

    router.patch(
      "/admin/:id",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.orderController.updateShippingStatus.bind(this.orderController)
    );

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

    router.get(
      "/provider/installments/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.orderController.getInstallmentsOrder.bind(this.orderController)
    );

    router.patch(
      "/provider/installments/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.orderController.updateInstallmentsOrder.bind(this.orderController)
    );

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
