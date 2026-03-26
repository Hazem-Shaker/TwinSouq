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
    router.post(
      "/user",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.createForUser.bind(this.addressController)
    );

    router.post(
      "/provider",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.addressController.createForProvider.bind(this.addressController)
    );

    // Update Address
    router.put(
      "/user/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.updateForUser.bind(this.addressController)
    );

    router.put(
      "/provider/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.addressController.updateForProvider.bind(this.addressController)
    );

    // List Addresses
    router.get(
      "/user",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.listForUser.bind(this.addressController)
    );

    router.get(
      "/provider",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.addressController.listForProvider.bind(this.addressController)
    );

    // Get Address by ID
    router.get(
      "/user/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.getForUser.bind(this.addressController)
    );

    router.get(
      "/provider/:id",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.addressController.getForProvider.bind(this.addressController)
    );

    // Delete Address
    router.delete(
      "/user/:id",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.addressController.deleteForUser.bind(this.addressController)
    );

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
