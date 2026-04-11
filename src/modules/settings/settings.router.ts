import { SettingController } from "./settings.controller";
import { SettingService } from "./settings.service";
import { Router } from "express";
import { AdminAuthMiddleware } from "../../shared/middlewares/auth";
import {
  processImagesMiddleware,
  upload,
} from "../../shared/middlewares/upload";

export class SettingRouter {
  private settingController: SettingController;
  private SettingService: SettingService;
  adminAuthMiddleware: AdminAuthMiddleware;
  constructor(settingService: SettingService) {
    this.SettingService = settingService;
    this.adminAuthMiddleware = new AdminAuthMiddleware();
    this.settingController = new SettingController(this.SettingService);
  }

  createRouter() {
    const router = Router();


    /**
     * @openapi
     * /api/settings/admin:
     *   get:
     *     tags: [Settings]
     *     summary: GET /admin
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/admin",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.settingController.getSettingForAdmin.bind(this.settingController)
    );


    /**
     * @openapi
     * /api/settings:
     *   get:
     *     tags: [Settings]
     *     summary: GET /
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/",
      this.settingController.getSetting.bind(this.settingController)
    );


    /**
     * @openapi
     * /api/settings:
     *   put:
     *     tags: [Settings]
     *     summary: PUT /
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      "/",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      upload.fields([
        {
          name: "headerLogo",
          maxCount: 1,
        },
        {
          name: "footerLogo",
          maxCount: 1,
        },
      ]),
      processImagesMiddleware(["footerLogo", "headerLogo"]),
      this.settingController.updateSetting.bind(this.settingController)
    );

    return router;
  }
}
