import { mongo } from "mongoose";

import { ProductService } from "../../modules/products/product.service";
import { CartService } from "../carts/cart.service";
import { AddressService } from "../addresses/address.service";
import { PaymentService } from "../payment/payment.service";

import { ListForProviderLogic } from "./provider/list";

import { ListForUserLogic } from "./user/list";
import { CreateOrderLogic } from "./user/create-order";
import { CreateInstallmentsOrderLogic } from "./user/create-installments-order";
import { ListInstallmentsOrderForUserLogic } from "./user/list-installments-order";
import { PayInstallmentsLogic } from "./user/pay-installments";
import { GetInstallmentsOrderForUserLogic } from "./user/get-installments-order";

import { ListForAdminLogic } from "./admin/list";
import { UpdateShippingStatusLogic } from "./admin/update-shipping-status";

import { ListInstallmentsOrderForProviderLogic } from "./provider/list-installments-order";
import { InstallmentsOrderUpdateLogic } from "./provider/installments-order-update";
import { GetInstallmentsOrderForProviderLogic } from "./provider/get-installments-order";

import { CancelInstallmentsOrderLogic } from "./provider/cancel-installments-order";
import { EarningService } from "../earnings/earning.service";
export class OrderService {
  // admin
  private listForAdminLogic: ListForAdminLogic;
  private updateShippingStatusLogic: UpdateShippingStatusLogic;

  // user
  private listForUserLogic: ListForUserLogic;
  private createOrderLogic: CreateOrderLogic;
  private createInstallmentsOrderLogic: CreateInstallmentsOrderLogic;
  private listInstallmentsOrderForUserLogic: ListInstallmentsOrderForUserLogic;
  private payInstallmentsLogic: PayInstallmentsLogic;
  private getInstallmentsOrderForUserLogic: GetInstallmentsOrderForUserLogic;

  // provider
  private listForProviderLogic: ListForProviderLogic;
  private listInstallmentsOrderForProviderLogic: ListInstallmentsOrderForProviderLogic;
  private installmentsOrderUpdateLogic: InstallmentsOrderUpdateLogic;
  private getInstallmentsOrderForProviderLogic: GetInstallmentsOrderForProviderLogic;

  private cancelInstallmentsOrderLogic: CancelInstallmentsOrderLogic;

  constructor(
    private productService: ProductService,
    private paymentService: PaymentService,
    private cartService: CartService,
    private addressService: AddressService,
    private earningService: EarningService
  ) {
    // admin
    this.listForAdminLogic = new ListForAdminLogic();
    this.updateShippingStatusLogic = new UpdateShippingStatusLogic(
      this.earningService
    );

    // user
    this.listForUserLogic = new ListForUserLogic();
    this.createOrderLogic = new CreateOrderLogic();
    this.createInstallmentsOrderLogic = new CreateInstallmentsOrderLogic(
      this.productService,
      this.addressService
    );
    this.listInstallmentsOrderForUserLogic =
      new ListInstallmentsOrderForUserLogic();
    this.payInstallmentsLogic = new PayInstallmentsLogic();
    this.getInstallmentsOrderForUserLogic =
      new GetInstallmentsOrderForUserLogic();

    // provider
    this.listForProviderLogic = new ListForProviderLogic();
    this.listInstallmentsOrderForProviderLogic =
      new ListInstallmentsOrderForProviderLogic();
    this.installmentsOrderUpdateLogic = new InstallmentsOrderUpdateLogic(
      this.productService
    );
    this.getInstallmentsOrderForProviderLogic =
      new GetInstallmentsOrderForProviderLogic();

    this.cancelInstallmentsOrderLogic = new CancelInstallmentsOrderLogic(
      this.productService
    );
  }

  listForAdmin(pagination: any, query: any, language: string) {
    return this.listForAdminLogic.execute({ pagination, query }, language);
  }
  updateShippingStatus(orderId: any, data: any, language: string) {
    return this.updateShippingStatusLogic.update(
      { orderId, ...data },
      language
    );
  }

  listForUser(user: any, pagination: any, query: any, language: string) {
    return this.listForUserLogic.list({ user, query, pagination }, language);
  }

  listForProvider(
    provider: any,
    pagination: any,
    query: any,
    language: string
  ) {
    return this.listForProviderLogic.list(
      { provider, query, pagination },
      language
    );
  }

  createOrder(user: any, data: any) {
    return this.createOrderLogic.create({ user, ...data });
  }

  createInstallmentsOrder(user: any, data: any, language: string) {
    return this.createInstallmentsOrderLogic.execute(
      { user, ...data },
      language
    );
  }

  listInstallmentsOrderForProvider(
    provider: any,
    pagination: any,
    query: any,
    language: string
  ) {
    return this.listInstallmentsOrderForProviderLogic.list(
      { provider, query, pagination },
      language
    );
  }

  updateInstallmentsOrder(provider: any, id: any, body: any, language: string) {
    return this.installmentsOrderUpdateLogic.update(
      { provider, id, ...body },
      language
    );
  }

  getInstallmentsOrder(provider: any, id: any, language: string) {
    return this.getInstallmentsOrderForProviderLogic.execute(
      { provider, id },
      language
    );
  }

  listInstallmentsOrderForUser(
    user: any,
    pagination: any,
    query: any,
    language: string
  ) {
    return this.listInstallmentsOrderForUserLogic.list(
      { user, query, pagination },
      language
    );
  }

  payInstallments(user: any, data: any, language: string) {
    return this.payInstallmentsLogic.execute({ user, ...data });
  }

  getInstallmentsOrderForUser(user: any, orderId: any, language: string) {
    return this.getInstallmentsOrderForUserLogic.execute(
      { user, orderId },
      language
    );
  }

  cancelInstallmentsOrder(provider: any, id: any) {
    return this.cancelInstallmentsOrderLogic.execute({
      provider,
      id,
    });
  }
}
