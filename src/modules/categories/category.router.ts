import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { Router } from "express";
import { AdminAuthMiddleware } from "../../shared/middlewares/auth";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";
import paginationMiddleware from "../../shared/middlewares/pagination";
import {
  processImagesMiddleware,
  upload,
} from "../../shared/middlewares/upload";

export class CategoryRouter {
  private categoryController: CategoryController;
  private categoryService: CategoryService;
  adminAuthMiddleware: AdminAuthMiddleware;
  userAuthMiddleware: UserAuthMiddleware;
  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
    this.adminAuthMiddleware = new AdminAuthMiddleware();
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.categoryController = new CategoryController(this.categoryService);
  }

  createRouter() {
    const router = Router();

    router
      .route("/admin")
      .post(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        upload.fields([
          {
            name: "image",
            maxCount: 1,
          },
        ]),
        processImagesMiddleware(["image"]),
        this.categoryController.createCategory.bind(this.categoryController)
      )
      .get(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        paginationMiddleware,
        this.categoryController.listCategoriesForAdmin.bind(
          this.categoryController
        )
      );

    router
      .route("/admin/:id")
      .get(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        this.categoryController.getCategoryForAdmin.bind(this.categoryController)
      )
      .put(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        upload.fields([
          {
            name: "image",
            maxCount: 1,
          },
        ]),
        processImagesMiddleware(["image"]),
        this.categoryController.updateCategory.bind(this.categoryController)
      );

    router
      .route("/admin/:slug")

      .delete(
        this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
        this.categoryController.deleteCategory.bind(this.categoryController)
      )

    router
      .route("/")
      .get(
        paginationMiddleware,
        this.categoryController.listCategories.bind(this.categoryController)
      );

    router
      .route("/:slug")
      .get(this.categoryController.getCategory.bind(this.categoryController));

    return router;
  }
}
