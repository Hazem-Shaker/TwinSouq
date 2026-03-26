import mongoose, { mongo } from "mongoose";
import Order from "../order.model";
import { IOrderArray, IOrderItem } from "../types";
import { inputSchema, Input } from "./input";
import { ProductService } from "../../../modules/products/product.service";

export class ConvertCartToOrderLogic {
  constructor(public productService: ProductService) {}

  async convert(input: Input, session: mongo.ClientSession) {
    input = inputSchema.parse(input);
    const orders: IOrderArray[] = [];
    const providerOrders = new Map<string, IOrderItem[]>();

    for (let product of input.products) {
      const providerId = product.provider.toString();
      if (!providerOrders.has(providerId)) {
        providerOrders.set(providerId, []);
      }
      const item: IOrderItem & { provider?: mongoose.Schema.Types.ObjectId } =
        product;

      providerOrders.get(providerId)?.push(item);
    }
    const variantIds: {
      variant: mongoose.Schema.Types.ObjectId;
      quantity: number;
    }[] = [];

    let totalPrice = 0;

    for (const [providerId, products] of providerOrders) {
      let price = 0;
      const shippingPrice = 200;

      const provider = products[0].provider;
      const user = input.user;

      for (let product of products) {
        price += (product.salePrice ?? product.price) * product.quantity;

        variantIds.push({
          variant: product.variant,
          quantity: product.quantity,
        });
      }

      totalPrice += shippingPrice + price;

      orders.push({
        user,
        provider,
        shippingPrice,
        products,
        price,
      });
    }

    const productUpdated = await this.productService.decreaseStock(
      variantIds,
      session
    );

    return { orders, totalPrice };
  }
}
