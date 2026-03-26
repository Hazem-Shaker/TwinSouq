"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertCartToOrderLogic = void 0;
const input_1 = require("./input");
class ConvertCartToOrderLogic {
    constructor(productService) {
        this.productService = productService;
    }
    async convert(input, session) {
        input = input_1.inputSchema.parse(input);
        const orders = [];
        const providerOrders = new Map();
        for (let product of input.products) {
            const providerId = product.provider.toString();
            if (!providerOrders.has(providerId)) {
                providerOrders.set(providerId, []);
            }
            const item = product;
            providerOrders.get(providerId)?.push(item);
        }
        const variantIds = [];
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
        const productUpdated = await this.productService.decreaseStock(variantIds, session);
        return { orders, totalPrice };
    }
}
exports.ConvertCartToOrderLogic = ConvertCartToOrderLogic;
