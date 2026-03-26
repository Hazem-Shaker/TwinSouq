import InstallmentsOrder from "../../installmentsOrder/installmentsOrder.model";
import Variant from "../../../products/product-variants/variant.model";
import { inputSchema, Input } from "./input";

export class ListInstallmentsOrderForProviderLogic {
  constructor() {}

  async list(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const { provider, pagination, query } = input;

    const matchQuery: any = {
      provider,
    };

    if (query.status) {
      matchQuery.status = query.status;
    }

    if (query.paymentStatus) {
      matchQuery.paymentStatus = query.paymentStatus;
    }

    const statusMap = new Map<string, string>();
    statusMap.set("sent", "قيد المراجعة");
    statusMap.set("approved", "تمت الموافقة");

    const paymentStatusMap = new Map<string, string>();
    paymentStatusMap.set("first-payment", "الدفعة الأولى");
    paymentStatusMap.set("late-payment", "دفعة متأخرة");
    paymentStatusMap.set("next-payment", "الدفعة القادمة");
    paymentStatusMap.set("done", "مكتمل");

    const orders = await InstallmentsOrder.aggregate([
      {
        $match: matchQuery,
      },
      { $sort: { createdAt: -1 } },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      {
        $lookup: {
          from: "variants",
          localField: "variant",
          foreignField: "_id",
          as: "variantDetails",
          pipeline: [
            {
              $unwind: {
                path: "$options",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "options",
                localField: "options.key",
                let: { valueId: "$options.value" },
                foreignField: "id",
                as: "optionsDetails",
                pipeline: [
                  {
                    $set: {
                      value: {
                        $filter: {
                          input: "$values",
                          as: "value",
                          cond: { $eq: ["$$value.id", "$$valueId"] },
                        },
                      },
                    },
                  },
                  {
                    $unwind: {
                      path: "$value",
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      name: language === "ar" ? "$name_ar" : "$name_en",
                      value:
                        language === "ar" ? "$value.name_ar" : "$value.name_en",
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$optionsDetails",
              },
            },
            {
              $group: {
                _id: "$_id",
                root: { $first: "$$ROOT" },
                optionsDetails: { $push: "$optionsDetails" },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ["$root", { options: "$optionsDetails" }],
                },
              },
            },
            {
              $project: {
                optionsDetails: 0,
                _id: 0,
                __v: 0,
                product: 0,
                optionsString: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$variantDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: "$_id",
          user: 1,
          provider: 1,
          product: 1,
          options: "$variantDetails.options",
          price: 1,
          initialPayment: 1,
          eachPayment: 1,
          numberOfMonths: 1,
          donePayments: 1,
          iban: 1,
          createdAt: 1,
          updatedAt: 1,
          name: {
            $cond: {
              if: { $eq: [language, "ar"] },
              then: "$name_ar",
              else: "$name_en",
            },
          },
          status: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$status", "sent"] },
                  then: language === "en" ? "sent" : statusMap.get("sent"),
                },
                {
                  case: { $eq: ["$status", "approved"] },
                  then: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$paymentStatus", "first-payment"] },
                          then:
                            language === "en"
                              ? "first-payment"
                              : paymentStatusMap.get("first-payment"),
                        },
                        {
                          case: { $eq: ["$paymentStatus", "late-payment"] },
                          then:
                            language === "en"
                              ? "late-payment"
                              : paymentStatusMap.get("late-payment"),
                        },
                        {
                          case: { $eq: ["$paymentStatus", "next-payment"] },
                          then:
                            language === "en"
                              ? "next-payment"
                              : paymentStatusMap.get("next-payment"),
                        },
                        {
                          case: { $eq: ["$paymentStatus", "done"] },
                          then:
                            language === "en"
                              ? "done"
                              : paymentStatusMap.get("done"),
                        },
                      ],
                      default: "غير معروف",
                    },
                  },
                },
                {
                  case: { $eq: ["$status", "rejected"] },
                  then: language === "en" ? "rejected" : "مرفوض",
                },
              ],
              default: "غير معروف",
            },
          },
        },
      },
    ]);

    const totalCount = await InstallmentsOrder.countDocuments(matchQuery);
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: orders,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
