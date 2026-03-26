"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInstallmentsOrderLogic = void 0;
const input_1 = require("./input");
const installmentsOrder_model_1 = __importDefault(require("../../installmentsOrder/installmentsOrder.model"));
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const files_1 = require("../../../../shared/utils/files");
class CreateInstallmentsOrderLogic {
    constructor(productService, addressService) {
        this.productService = productService;
        this.addressService = addressService;
    }
    async execute(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        // get product data
        const { product, variant } = await this.productService.getForInstallmentsOrder(input.product, input.variant);
        if (product?.paymentChoices === "cash") {
            throw new custom_errors_1.ForbiddenError("product_not_eligable_for_installments");
        }
        const installmentOptions = product.installmentOptions.find((value) => value._id.toString() === input.installmentOption.toString());
        if (!installmentOptions) {
            throw new custom_errors_1.NotFoundError("installment_option_not_found");
        }
        const productPrice = variant.price ? variant.price : product.price;
        const price = productPrice * (installmentOptions.profitPercantage / 100) + productPrice;
        const initialPayment = (price * installmentOptions.upfrontPercentage) / 100;
        const eachPayment = (price - initialPayment) / installmentOptions.period;
        const address = await this.addressService.getAddressForUser(input.address, input.user);
        if (!address) {
            throw new custom_errors_1.BadRequestError("address_not_found");
        }
        // create order with intial data
        const order = await installmentsOrder_model_1.default.create({
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
        await (0, files_1.markFilesAsUsed)([
            order.contract,
            order.accountStatement,
            order.salaryCertificate,
        ]);
        return order;
    }
}
exports.CreateInstallmentsOrderLogic = CreateInstallmentsOrderLogic;
