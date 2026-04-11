import { Router } from "express";
import {
  UserAuthMiddleware,
  ProviderAuthMiddleware,
} from "../../shared/middlewares/auth";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";

export class AddressRouter {
  private userAuthMiddleware: UserAuthMiddleware;
  private providerAuthMiddleware: ProviderAuthMiddleware;
  addressController: AddressController;

  constructor(public addressService: AddressService) {
    this.addressController = new AddressController(this.addressService);
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.providerAuthMiddleware = new ProviderAuthMiddleware();
  }

  createRouter() {
    const router = Router();

    // Create Address

    /**
     * @openapi
     * /api/addresses/user:
     *   post:
     *     tags: [Addresses]
     *     summary: POST /user
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      "/user",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.createForUser.bind(this.addressController)
    );


    /**
     * @openapi
     * /api/addresses/provider:
     *   post:
     *     tags: [Addresses]
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
      this.addressController.createForProvider.bind(this.addressController)
    );

    // Update Address

    /**
     * @openapi
     * /api/addresses/user/:id:
     *   put:
     *     tags: [Addresses]
     *     summary: PUT /user/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      "/user/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.updateForUser.bind(this.addressController)
    );


    /**
     * @openapi
     * /api/addresses/provider/:id:
     *   put:
     *     tags: [Addresses]
     *     summary: PUT /provider/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      "/provider/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.addressController.updateForProvider.bind(this.addressController)
    );

    // List Addresses

    /**
     * @openapi
     * /api/addresses/user:
     *   get:
     *     tags: [Addresses]
     *     summary: GET /user
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/user",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.listForUser.bind(this.addressController)
    );


    /**
     * @openapi
     * /api/addresses/provider:
     *   get:
     *     tags: [Addresses]
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
      this.addressController.listForProvider.bind(this.addressController)
    );

    // Get Address by ID

    /**
     * @openapi
     * /api/addresses/user/:id:
     *   get:
     *     tags: [Addresses]
     *     summary: GET /user/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/user/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.getForUser.bind(this.addressController)
    );


    /**
     * @openapi
     * /api/addresses/provider/:id:
     *   get:
     *     tags: [Addresses]
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
      this.addressController.getForProvider.bind(this.addressController)
    );

    // Delete Address

    /**
     * @openapi
     * /api/addresses/user/:id:
     *   delete:
     *     tags: [Addresses]
     *     summary: DELETE /user/:id
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      "/user/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.deleteForUser.bind(this.addressController)
    );


    /**
     * @openapi
     * /api/addresses/provider/:id:
     *   delete:
     *     tags: [Addresses]
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
      this.addressController.deleteForProvider.bind(this.addressController)
    );

    return router;
  }
}
