import { imageAggregate } from "./images";
import { unwindQuery } from "./unwind";

export const productListForProvider = (language: string = "en") => {
  const projection: any[] = [];

  if (language === "ar") {
    projection.push({
      $project: {
        id: "$_id",
        name: "$name_ar",
        description: "$description_ar",
        price: 1,
        salePrice: 1,
        category: 1,
        views: 1,
        image: { $arrayElemAt: ["$images", 0] },
        lastModified: {
          $dateToString: {
            format: "%d/%m/%Y",
            date: "$updatedAt",
          },
        },
      },
    });
  }
  if (language === "en") {
    projection.push({
      $project: {
        id: "$_id",
        name: "$name_en",
        description: "$description_en",
        price: 1,
        salePrice: 1,
        category: 1,
        views: 1,
        image: { $arrayElemAt: ["$images", 0] },
        lastModified: {
          $dateToString: {
            format: "%d/%m/%Y",
            date: "$updatedAt",
          },
        },
      },
    });
  }

  return [...imageAggregate("images", false), ...projection];
};

export const productDetailsForProvider = (language: string = "en") => {
  return [
    ...imageAggregate("images", false),
    ...unwindQuery("installmentOptions", true),
    ...imageAggregate("installmentOptions.contract"),
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
  ];
};

export const prodcutListForUser = (language: string = "en") => {
  const projection: any[] = [];

  if (language === "ar") {
    projection.push({
      $project: {
        id: "$_id",
        name: "$name_ar",
        description: "$description_ar",
        price: 1,
        salePrice: 1,
        views: 1,
        image: { $arrayElemAt: ["$images", 0] },
        rating: 1,
        isFavorite: 1,
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
  if (language === "en") {
    projection.push({
      $project: {
        id: "$_id",
        name: "$name_en",
        description: "$description_en",
        price: 1,
        salePrice: 1,
        views: 1,
        image: { $arrayElemAt: ["$images", 0] },
        rating: 1,
        isFavorite: 1,
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

  return [...imageAggregate("images", false), ...projection];
};
