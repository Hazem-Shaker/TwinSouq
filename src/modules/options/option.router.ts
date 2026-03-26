import { OptionController } from "./option.controller";
import { OptionService } from "./option.service";
import { Router } from "express";
import { AdminAuthMiddleware } from "../../shared/middlewares/auth";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";
import paginationMiddleware from "../../shared/middlewares/pagination";
import {
  processImagesMiddleware,
  upload,
} from "../../shared/middlewares/upload";

export class OptionRouter {
  private optionController: OptionController;
  private optionService: OptionService;
  adminAuthMiddleware: AdminAuthMiddleware;
  userAuthMiddleware: UserAuthMiddleware;

  constructor(optionService: OptionService) {
    this.optionService = optionService;
    this.adminAuthMiddleware = new AdminAuthMiddleware();
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.optionController = new OptionController(this.optionService);
  }

  createRouter() {
    const router = Router();

    // Admin routes
    router
      .route("/admin")
      .post(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        this.optionController.createOption.bind(this.optionController)
      );

    router
      .route("/admin/:id")
      .put(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        this.optionController.updateOption.bind(this.optionController)
      )
      .delete(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        this.optionController.deleteOption.bind(this.optionController)
      );

    router.get(
      "/admin/categories/:categoryId",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.optionController.listByCategoryIdForAdmin.bind(this.optionController)
    );

    router.get(
      "/admin/:id",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.optionController.getForAdmin.bind(this.optionController)
    );

    // Public routes
    router
      .route("/categories/:categoryId")
      .get(this.optionController.listByCategoryId.bind(this.optionController));

    return router;
  }
}
