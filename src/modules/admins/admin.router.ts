import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { Router } from "express";
import { AdminAuthMiddleware } from "../../shared/middlewares/auth";
import { upload } from "../../shared/middlewares/upload";

export class AdminRouter {
  private adminController: AdminController;
  private adminService: AdminService;
  adminAuthMiddleware: AdminAuthMiddleware;
  constructor(
    adminService: AdminService,
    adminAuthMiddleware: AdminAuthMiddleware
  ) {
    this.adminService = adminService;
    this.adminAuthMiddleware = adminAuthMiddleware;
    this.adminController = new AdminController(this.adminService);
  }

  createRouter() {
    const router = Router();


    /**
     * @openapi
     * /api/admins/create:
     *   post:
     *     tags: [Admins]
     *     summary: POST /create
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/create",
      upload.any(),
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.adminController.createAdmin.bind(this.adminController)
    );


    /**
     * @openapi
     * /api/admins/login:
     *   post:
     *     tags: [Admins]
     *     summary: POST /login
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/login",
      upload.any(),
      this.adminController.login.bind(this.adminController)
    );

    return router;
  }
}
