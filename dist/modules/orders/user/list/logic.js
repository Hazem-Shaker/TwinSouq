"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListForUserLogic = void 0;
const order_model_1 = __importDefault(require("../../order.model"));
const input_1 = require("./input");
class ListForUserLogic {
    constructor() { }
    async list(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const { pagination } = input;
        const matchQuery = {
            user: input.user,
            paymentStatus: "paid",
            shippingStatus: "pending",
        };
        const { query } = input;
        if (query.status === "pending") {
            matchQuery.shippingStatus = { $ne: "delivered" };
        }
        const statusMap = new Map();
        statusMap.set("pending", "قيد الانتظار");
        statusMap.set("shipped", "تم الشحن");
        statusMap.set("delivered", "تم التوصيل");
        const orders = await order_model_1.default.aggregate([
            {
                $match: matchQuery,
            },
            { $sort: { createdAt: -1 } },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    provider: 1,
                    price: 1,
                    shippingPrice: 1,
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
                    status: {
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
                },
            },
        ]);
        const totalCount = await order_model_1.default.countDocuments(matchQuery);
        const totalPages = Math.ceil(totalCount / pagination.limit);
        return {
            results: orders,
            totalCount,
            totalPages,
            currentPage: pagination.page,
        };
    }
}
exports.ListForUserLogic = ListForUserLogic;
