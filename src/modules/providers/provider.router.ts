import { Router } from "express";
import { ProviderController } from "./provider.controller";
import {
  UserAuthMiddleware,
  AdminAuthMiddleware,
  ProviderAuthMiddleware,
} from "../../shared/middlewares/auth";
import pagination from "../../shared/middlewares/pagination";
import {
  processImagesMiddleware,
  upload,
} from "../../shared/middlewares/upload";
import { ProviderService } from "./provider.service";

export class ProviderRouter {
  private providerController: ProviderController;
  private userAuthMiddleware: UserAuthMiddleware;
  private adminAuthMiddleware: AdminAuthMiddleware;
  private providerAuthMiddleware: ProviderAuthMiddleware;
  providerService: ProviderService;

  constructor(providerService: ProviderService) {
    this.providerService = providerService;
    this.providerController = new ProviderController(this.providerService);
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.adminAuthMiddleware = new AdminAuthMiddleware();
    this.providerAuthMiddleware = new ProviderAuthMiddleware();
  }

  createRouter() {
    const router = Router();


    /**
     * @openapi
     * /api/providers/requests:
     *   post:
     *     tags: [Providers]
     *     summary: POST /requests
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/requests",
      this.userAuthMiddleware.authenticateWithProviderRole.bind(
        this.userAuthMiddleware
      ),
      upload.fields([
        {
          name: "photo",
          maxCount: 1,
        },
        {
          name: "idImageFront",
          maxCount: 1,
        },
        {
          name: "idImageBack",
          maxCount: 1,
        },
      ]),
      processImagesMiddleware(["photo", "idImageFront", "idImageBack"]),
      this.providerController.createProviderRequest.bind(
        this.providerController
      )
    );


    /**
     * @openapi
     * /api/providers/requests:
     *   get:
     *     tags: [Providers]
     *     summary: GET /requests
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/requests",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      pagination,
      this.providerController.listProviderRequests.bind(this.providerController)
    );


    /**
     * @openapi
     * /api/providers/requests/:providerRequestId:
     *   get:
     *     tags: [Providers]
     *     summary: GET /requests/:providerRequestId
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/requests/:providerRequestId",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.providerController.getProviderRequest.bind(this.providerController)
    );


    /**
     * @openapi
     * /api/providers/requests/:providerRequestId/accept:
     *   post:
     *     tags: [Providers]
     *     summary: POST /requests/:providerRequestId/accept
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/requests/:providerRequestId/accept",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.providerController.acceptProviderRequest.bind(
        this.providerController
      )
    );


    /**
     * @openapi
     * /api/providers/requests/:providerRequestId/reject:
     *   delete:
     *     tags: [Providers]
     *     summary: DELETE /requests/:providerRequestId/reject
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      "/requests/:providerRequestId/reject",
      this.adminAuthMiddleware.authenticate.bind(this.adminAuthMiddleware),
      this.providerController.rejectProviderRequest.bind(
        this.providerController
      )
    );


    /**
     * @openapi
     * /api/providers/stats:
     *   get:
     *     tags: [Providers]
     *     summary: GET /stats
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/stats",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.providerController.getProviderStats.bind(this.providerController)
    );


    /**
     * @openapi
     * /api/providers/home-page:
     *   get:
     *     tags: [Providers]
     *     summary: GET /home-page
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/home-page",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.providerController.getProviderHomePage.bind(this.providerController)
    );
    return router;
  }
}
