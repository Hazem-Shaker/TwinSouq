import { inputSchema, Input } from "./input";
import InstallmentsOrder from "../../installmentsOrder/installmentsOrder.model";
import { ProductService } from "../../../products/product.service";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../../shared/utils/custom-errors";
import mongoose from "mongoose";
import { markFilesAsUsed } from "../../../../shared/utils/files";
import { AddressService } from "../../../addresses/address.service";

export class CreateInstallmentsOrderLogic {
  constructor(
    private productService: ProductService,
    private readonly addressService: AddressService
  ) {}

  async execute(input: Input, language: string = "en") {
    input = inputSchema.parse(input);

    // get product data
    const { product, variant } =
      await this.productService.getForInstallmentsOrder(
        input.product,
        input.variant
      );

    if (product?.paymentChoices === "cash") {
      throw new ForbiddenError("product_not_eligable_for_installments");
    }

    const installmentOptions = product.installmentOptions.find(
      (value: { _id: mongoose.Types.ObjectId }) =>
        value._id.toString() === input.installmentOption.toString()
    );

    if (!installmentOptions) {
      throw new NotFoundError("installment_option_not_found");
    }

    const productPrice = variant.price ? variant.price : product.price;

    const price =
      productPrice * (installmentOptions.profitPercantage / 100) + productPrice;

    const initialPayment = (price * installmentOptions.upfrontPercentage) / 100;
    const eachPayment = (price - initialPayment) / installmentOptions.period;

    const address = await this.addressService.getAddressForUser(
      input.address,
      input.user
    );

    if (!address) {
      throw new BadRequestError("address_not_found");
    }

    // create order with intial data
    const order = await InstallmentsOrder.create({
      user: input.user,
      provider: product.provider,
      product: product._id,
      variant: input.variant,
      status: "sent",
      paymentStatus: "first-payment",
      shippingStatus: "pending",
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: price.toFixed(2),
      profitPercent: product.profitPercent,
      initialPayment: initialPayment.toFixed(2),
      eachPayment: eachPayment.toFixed(2),
      numberOfMonths: installmentOptions.period,
      donePayments: 0,
      accountStatement: input.accountStatement[0]._id,
      salaryCertificate: input.salaryCertificate[0]._id,
      contract: input.contract[0]._id,
      iban: input.iban,
      address: input.address,
    });

    await markFilesAsUsed([
      order.contract,
      order.accountStatement,
      order.salaryCertificate,
    ]);

    return order;
  }
}
