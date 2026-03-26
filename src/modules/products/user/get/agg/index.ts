import {
  imageAggregate,
  unwindQuery,
} from "../../../../../shared/utils/aggregations";

export const aggregateProductDetails = (language: string = "en") => {
  const queries: any[] = [
    ...imageAggregate("images", false),
    ...unwindQuery("installmentOptions", true),
    ...imageAggregate("installmentOptions.contract"),
    {
      $set: {
        "installmentOptions.id": "$installmentOptions._id",
      },
    },
    {
      $group: {
        _id: "$_id", // Group by the original document ID
        root: { $first: "$$ROOT" }, // Preserve the original document structure
        installmentOptions: { $push: "$installmentOptions" }, // Rebuild the optionsDetails array
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$root",
            { installmentOptions: "$installmentOptions" },
          ],
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
        pipeline: [
          ...(language === "ar"
            ? [
                {
                  $project: {
                    id: "$_id",
                    name: "$name_ar",
                    _id: 0,
                  },
                },
              ]
            : [
                {
                  $project: {
                    id: "$_id",
                    name: "$name_en",
                    _id: 0,
                  },
                },
              ]),
        ],
      },
    },
    ...unwindQuery("category", true),
  ];

  if (language === "en") {
    queries.push({
      $project: {
        id: "$_id",
        name: "$name_en",
        description: "$description_en",
        price: 1,
        salePrice: 1,
        views: 1,
        images: 1,
        installmentOptions: 1,
        rating: 1,
        isFavorite: 1,
        reviewsCount: 1,
        category: 1,
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
      },
    });
  } else {
    queries.push({
      $project: {
        id: "$_id",
        name: "$name_ar",
        description: "$description_ar",
        price: 1,
        salePrice: 1,
        views: 1,
        images: 1,
        isFavorite: 1,
        installmentOptions: 1,
        rating: 1,
        category: 1,
        reviewsCount: 1,
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
      },
    });
  }

  return queries;
};

export const aggregateVariantDetails = (language: string = "en") => {
  const projection: any[] = [];
  if (language === "en") {
    projection.push({
      $project: {
        _id: 0,
        name: "$name_en",
        value: "$value.name_en",
      },
    });
  }
  if (language === "ar") {
    projection.push({
      $project: {
        _id: 0,
        name: "$name_ar",
        value: "$value.name_ar",
      },
    });
  }
  return [
    ...imageAggregate("images", false),

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
    {
      $set: {
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
        optionsDetails: 0,
        _id: 0,
        __v: 0,
        product: 0,
        optionsString: 0,
      },
    },
  ];
};

export const aggregateVariantList = (language: string = "en") => {
  const projection: any[] = [];
  if (language === "en") {
    projection.push({
      $project: {
        _id: 0,
        name: "$name_en",
        value: "$value.name_en",
      },
    });
  }
  if (language === "ar") {
    projection.push({
      $project: {
        _id: 0,
        name: "$name_ar",
        value: "$value.name_ar",
      },
    });
  }
  return [
    {
      $project: {
        options: 1,
        _id: 1,
      },
    },

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
    { $set: { id: "$_id" } },
    {
      $project: {
        optionsDetails: 0,

        _id: 0,
        __v: 0,
        product: 0,
        optionsString: 0,
      },
    },
  ];
};
