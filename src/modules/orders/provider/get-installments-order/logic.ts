import InstallmentsOrder from "../../installmentsOrder/installmentsOrder.model";
import { Input, inputSchema } from "./input";
import { NotFoundError } from "../../../../shared/utils/custom-errors";
import { fileAggregate } from "../../../../shared/utils/aggregations";

export class GetInstallmentsOrderForProviderLogic {
  constructor() {}

  async execute(input: Input, language: string = "en") {
    const { provider, id } = inputSchema.parse(input);

    const statusMap = new Map<string, string>();
    statusMap.set("sent", "قيد المراجعة");
    statusMap.set("approved", "تمت الموافقة");

    const paymentStatusMap = new Map<string, string>();
    paymentStatusMap.set("first-payment", "الدفعة الأولى");
    paymentStatusMap.set("late-payment", "دفعة متأخرة");
    paymentStatusMap.set("next-payment", "الدفعة القادمة");
    paymentStatusMap.set("done", "مكتمل");

    const order = await InstallmentsOrder.aggregate([
      {
        $match: {
          _id: id,
          provider: provider,
        },
      },
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
      // Lookup user information
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                phone: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...fileAggregate("accountStatement", true),
      ...fileAggregate("salaryCertificate", true),
      ...fileAggregate("contract", true),
      {
        $set: {
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
          shippingStatus: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$shippingStatus", "pending"] },
                  then: {
                    $cond: {
                      if: { $eq: [language, "ar"] },
                      then: "قيد الانتظار",
                      else: "pending",
                    },
                  },
                },
                {
                  case: { $eq: ["$shippingStatus", "shipped"] },
                  then: {
                    $cond: {
                      if: { $eq: [language, "ar"] },
                      then: "تم الشحن",
                      else: "shipped",
                    },
                  },
                },
                {
                  case: { $eq: ["$shippingStatus", "delivered"] },
                  then: {
                    $cond: {
                      if: { $eq: [language, "ar"] },
                      then: "تم التوصيل",
                      else: "delivered",
                    },
                  },
                },
              ],
              default: {
                $cond: {
                  if: { $eq: [language, "ar"] },
                  then: "غير معروف",
                  else: "unknown",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          id: "$_id",
          productDetails: {
            id: "$product",
            variant: "$variantDetails._id",
            name: {
              $cond: {
                if: { $eq: [language, "ar"] },
                then: "$name_ar",
                else: "$name_en",
              },
            },
            options: "$variantDetails.options",
            totalPrice: "$price",
            amount: 1,
            orderedAt: {
              $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
            },
            shippingStatus: "$shippingStatus",
          },
          installmentsDetails: {
            remainingAmount: {
              $subtract: ["$price", "$paidAmount"],
            },
            donePayments: "$donePayments",
            remainingPayments: {
              $subtract: [{ $add: ["$numberOfMonths", 1] }, "$donePayments"],
            },
            status: "$status",
          },
          nextPayment: {
            amount: {
              $ifNull: ["$nextPayment.amount", "$initialPayment"],
            },
            dueDate: {
              $cond: {
                if: { $ifNull: ["$nextPayment.date", null] },
                then: {
                  $dateToString: {
                    format: "%d/%m/%Y",
                    date: "$nextPayment.date",
                  },
                },
                else: {
                  $cond: {
                    if: { $eq: [language, "ar"] },
                    then: "لم يتم التحديد بعد",
                    else: "not specified yet",
                  },
                },
              },
            },
          },
          paidInstallments: {
            $map: {
              input: "$paidInstallments",
              as: "installment",
              in: {
                order: "$$installment.order",
                amount: "$$installment.amount",
                date: {
                  $dateToString: {
                    format: "%d/%m/%Y",
                    date: "$$installment.date",
                  },
                },
              },
            },
          },
          userDetails: {
            id: "$userDetails._id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            phone: "$userDetails.phone",
            accountStatement: "$accountStatement",
            salaryCertificate: "$salaryCertificate",
            contract: "$contract",
            iban: "$iban",
          },
        },
      },
    ]);

    if (!order.length) {
      throw new NotFoundError("order_not_found");
    }

    return order[0];
  }
}
