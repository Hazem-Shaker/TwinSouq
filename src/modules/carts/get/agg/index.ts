import { imageAggregate } from "../../../../shared/utils/aggregations";

export const productData = (
  language: string = "en",
  forOrder: boolean = false
) => {
  const projection: any[] = [];

  if (!forOrder && language === "ar") {
    projection.push({
      $project: {
        id: "$_id",
        name: "$name_ar",
        description: "$description_ar",
        price: 1,
        salePrice: 1,
        views: 1,
        provider: 1,
        image: { $arrayElemAt: ["$images", 0] },
      },
    });
  }
  if (!forOrder && language === "en") {
    projection.push({
      $project: {
        id: "$_id",
        name: "$name_en",
        description: "$description_en",
        price: 1,
        salePrice: 1,
        views: 1,
        provider: 1,
        image: { $arrayElemAt: ["$images", 0] },
      },
    });
  }

  if (forOrder) {
    projection.push({
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    });
    projection.push({
      $unwind: {
        path: "$category",
      },
    });
    projection.push({
      $set: {
        profitPercent: "$category.profitPercentage",
      },
    });
    projection.push({
      $project: {
        id: "$_id",
        name_ar: 1,
        name_en: 1,
        description_ar: 1,
        description_en: 1,
        price: 1,
        salePrice: 1,
        profitPercent: 1,
        provider: 1,
        image: { $arrayElemAt: ["$images", 0] },
      },
    });
  }
  console.log(projection);

  return [...imageAggregate("images", false), ...projection];
};

export const aggregateVariantDetails = (
  language: string = "en",
  forOrder: boolean = false
) => {
  const projection: any[] = [];
  if (!forOrder && language === "en") {
    projection.push({
      $project: {
        _id: 0,
        name: "$name_en",
        value: "$value.name_en",
      },
    });
  }
  if (!forOrder && language === "ar") {
    projection.push({
      $project: {
        _id: 0,
        name: "$name_ar",
        value: "$value.name_ar",
      },
    });
  }
  if (forOrder) {
    projection.push({
      $project: {
        _id: 0,
        name_ar: 1,
        name_en: 1,
        value_ar: "$value.name_ar",
        value_en: "$value.name_en",
      },
    });
  }
  return [
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
        let: {
          valueId: "$options.value",
        },
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
          ...projection,
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
        _id: "$_id", // Group by the original document ID
        root: { $first: "$$ROOT" }, // Preserve the original document structure
        optionsDetails: { $push: "$optionsDetails" }, // Rebuild the optionsDetails array
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$root", { options: "$optionsDetails" }],
        },
      },
    },
    ...imageAggregate("images", false),
    {
      $set: {
        image: {
          $cond: {
            if: { $eq: [{ $size: "$images" }, 0] }, // Check if images array length is 0
            then: null, // Assign null if images is empty
            else: { $arrayElemAt: ["$images", 0] }, // Otherwise, get the first element
          },
        },
        salePercent: {
          $cond: {
            if: { $ne: ["$salePrice", null] }, // Check if salePrice is not null
            then: {
              $floor: {
                // Floor the value
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$price", "$salePrice"] },
                      "$price",
                    ],
                  },
                  100,
                ],
              },
            },
            else: null, // Return null if salePrice is null
          },
        },
        variant: "$_id",
      },
    },
    {
      $project: {
        images: 0,
        optionsDetails: 0,
        _id: 0,
        __v: 0,
        product: 0,
        optionsString: 0,
      },
    },
  ];
};

export const aggregateCartDetails = (
  language: string = "en",
  forOrder: boolean = false
) => {
  const agg: any[] = [
    {
      $unwind: {
        path: "$products",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.id",
        foreignField: "_id",
        as: "products.product",
        pipeline: [...productData(language, forOrder)],
      },
    },
    {
      $unwind: {
        path: "$products.product",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "variants",
        localField: "products.variant",
        foreignField: "_id",
        as: "products.variant",
        pipeline: [...aggregateVariantDetails(language, forOrder)],
      },
    },
    {
      $unwind: {
        path: "$products.variant",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $set: {
        "products.options": "$products.variant.options",
      },
    },
    ...(forOrder
      ? [
          {
            $set: {
              "products.name_ar": "$products.product.name_ar",
              "products.name_en": "$products.product.name_en",
              "products.description_ar": "$products.product.description_ar",
              "products.description_en": "$products.product.description_en",
              "products.profitPercent": "$products.product.profitPercent",
            },
          },
        ]
      : []),

    {
      $set: {
        "products.name": "$products.product.name",
        "products.description": "$products.product.description",
        "products.price": {
          $cond: {
            if: { $ne: ["$products.variant.price", null] }, // Check if salePrice is not null
            then: "$products.variant.price",
            else: "$products.product.price", // Return null if salePrice is null
          },
        },
        "products.salePrice": {
          $cond: {
            if: { $ne: ["$products.variant.price", null] }, // Check if salePrice is not null
            then: "$products.variant.salePrice",
            else: "$products.product.salePrice", // Return null if salePrice is null
          },
        },
        "products.variant": "$products.variant.variant",
        "products.provider": "$products.product.provider",
        "products.image": {
          $cond: {
            if: { $ne: ["$products.variant.image", null] }, // Check if salePrice is not null
            then: "$products.variant.image",
            else: "$products.product.image", // Return null if salePrice is null
          },
        },
      },
    },
    {
      $set: {
        "products.salePercent": {
          $cond: {
            if: { $ne: ["$products.salePrice", null] }, // Check if salePrice is not null
            then: {
              $floor: {
                // Floor the value
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$products.price", "$products.salePrice"] },
                      "$products.price",
                    ],
                  },
                  100,
                ],
              },
            },
            else: null, // Return null if salePrice is null
          },
        },
      },
    },
    {
      $project: {
        "products.product": 0,
        "products._id": 0,
      },
    },
    {
      $group: {
        _id: "$_id", // Group by the original document ID
        root: { $first: "$$ROOT" }, // Preserve the original document structure
        products: { $push: "$products" }, // Rebuild the optionsDetails array
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$root", { products: "$products" }],
        },
      },
    },
    {
      $set: {
        totalPrice: {
          $sum: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                $multiply: [
                  { $ifNull: ["$$product.salePrice", "$$product.price"] },
                  "$$product.quantity",
                ],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        id: "$_id",
        _id: 0,
        products: 1,
        totalPrice: 1,
        user: 1,
        ...(forOrder ? { status: 1 } : {}),
      },
    },
  ];

  return agg;
};

export const aggregateForOrder = () => {
  return aggregateCartDetails("en", true);
};
