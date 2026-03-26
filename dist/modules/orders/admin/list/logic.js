"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListForAdminLogic = void 0;
const order_model_1 = __importDefault(require("../../order.model"));
class ListForAdminLogic {
    constructor() { }
    async execute(input, language = "en") {
        const { pagination, query } = input;
        const { paymentStatus, shippingStatus } = query;
        const matchQuery = {
            paymentStatus: "paid",
            shippingStatus: "shipped",
        };
        if (paymentStatus) {
            matchQuery.paymentStatus = paymentStatus;
        }
        if (shippingStatus) {
            matchQuery.shippingStatus = shippingStatus;
        }
        const statusMap = new Map();
        statusMap.set("pending", "قيد الانتظار");
        statusMap.set("shipped", "تم الشحن");
        statusMap.set("delivered", "تم التوصيل");
        const orders = await order_model_1.default.aggregate([
            {
                $match: matchQuery,
            },
            {
                $sort: { createdAt: 1 },
            },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            {
                $project: {
                    id: "$_id",
                    user: 1,
                    provider: 1,
                    price: 1,
                    shippingPrice: 1,
                    shippingStatus: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ["$shippingStatus", "pending"] },
                                    then: language === "en" ? "pending" : statusMap.get("pending"),
                                },
                                {
                                    case: { $eq: ["$shippingStatus", "shipped"] },
                                    then: language === "en" ? "shipped" : statusMap.get("shipped"),
                                },
                                {
                                    case: { $eq: ["$shippingStatus", "delivered"] },
                                    then: language === "en"
                                        ? "delivered"
                                        : statusMap.get("delivered"),
                                },
                            ],
                            default: "غير معروف",
                        },
                    },
                    paymentStatus: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    products: {
                        $map: {
                            input: "$products",
                            as: "product",
                            in: {
                                id: "$$product.id",
                                variant: "$$product.variant",
                                provider: "$$product.provider",
                                name: {
                                    $cond: {
                                        if: { $eq: [language, "ar"] },
                                        then: "$$product.name_ar",
                                        else: "$$product.name_en",
                                    },
                                },
                                description: {
                                    $cond: {
                                        if: { $eq: [language, "ar"] },
                                        then: "$$product.description_ar",
                                        else: "$$product.description_en",
                                    },
                                },
                                price: "$$product.price",
                                salePrice: "$$product.salePrice",
                                salePercent: "$$product.salePercent",
                                image: "$$product.image",
                                quantity: "$$product.quantity",
                                options: {
                                    $map: {
                                        input: "$$product.options",
                                        as: "option",
                                        in: {
                                            name: {
                                                $cond: {
                                                    if: { $eq: [language, "ar"] },
                                                    then: "$$option.name_ar",
                                                    else: "$$option.name_en",
                                                },
                                            },
                                            value: {
                                                $cond: {
                                                    if: { $eq: [language, "ar"] },
                                                    then: "$$option.value_ar",
                                                    else: "$$option.value_en",
                                                },
                                            },
                                            _id: "$$option._id",
                                        },
                                    },
                                },
                                _id: "$$product._id",
                            },
                        },
                    },
                },
            },
        ]);
        return orders;
    }
}
exports.ListForAdminLogic = ListForAdminLogic;
