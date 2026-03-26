import { AddressService } from "./address.service";
import { AddressRouter } from "./address.router";

export class AddressModule {
  private addressRouter: AddressRouter;
  addressService: AddressService;
  constructor() {
    this.addressService = new AddressService();
    this.addressRouter = new AddressRouter(this.addressService);
  }

  routerFactory() {
    return this.addressRouter.createRouter();
  }
}
