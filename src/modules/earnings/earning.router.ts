import { Router } from "express";
import { EarningController } from "./earning.controller";
import { EarningService } from "./earning.service";
import {
  ProviderAuthMiddleware,
  AdminAuthMiddleware,
} from "../../shared/middlewares/auth";
import paginationMiddleware from "../../shared/middlewares/pagination";

export class EarningRouter {
  private earningController: EarningController;

  private providerAuthMiddleware: ProviderAuthMiddleware;
  private adminAuthMiddleware: AdminAuthMiddleware;
  constructor(private earningService: EarningService) {
    this.earningController = new EarningController(this.earningService);
    this.providerAuthMiddleware = new ProviderAuthMiddleware();
    this.adminAuthMiddleware = new AdminAuthMiddleware();
  }

  createRouter() {
    const router = Router();

    router.get(
      "/wallet",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.earningController.getWalletBalance.bind(this.earningController)
    );

    router.post(
      "/withdraw",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.earningController.withdraw.bind(this.earningController)
    );

    router.patch(
      "/admin/payout/:id",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.earningController.confirmPayout.bind(this.earningController)
    );

    router.get(
      "/admin/payouts",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      paginationMiddleware,
      this.earningController.getPayoutsForAdmin.bind(this.earningController)
    );

    return router;
  }
}
