import Order from "../../order.model";
import { inputSchema, Input } from "./input";

export class ListForUserLogic {
  constructor() {}

  async list(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const { pagination } = input;
    const matchQuery: any = {
      user: input.user,
      paymentStatus: "paid",
      shippingStatus: "pending",
    };
    const { query } = input;
    if (query.status === "pending") {
      matchQuery.shippingStatus = { $ne: "delivered" };
    }

    const statusMap = new Map<string, string>();

    statusMap.set("pending", "قيد الانتظار");
    statusMap.set("shipped", "تم الشحن");
    statusMap.set("delivered", "تم التوصيل");

    const orders = await Order.aggregate([
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
                  then:
                    language === "en" ? "pending" : statusMap.get("pending"),
                },
                {
                  case: { $eq: ["$shippingStatus", "shipped"] },
                  then:
                    language === "en" ? "shipped" : statusMap.get("shipped"),
                },
                {
                  case: { $eq: ["$shippingStatus", "delivered"] },
                  then:
                    language === "en"
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

    const totalCount = await Order.countDocuments(matchQuery);
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: orders,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
