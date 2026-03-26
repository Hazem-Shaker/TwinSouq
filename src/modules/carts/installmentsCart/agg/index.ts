import { imageAggregate } from "../../../../shared/utils/aggregations";

export const productData = (language: string = "en") => {
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
        provider: 1,
        image: { $arrayElemAt: ["$images", 0] },
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
        provider: 1,
        image: { $arrayElemAt: ["$images", 0] },
      },
    });
  }

  return [...imageAggregate("images", false), ...projection];
};

export const aggregateCartData = (language: string = "en") => {
  return [
    {
      $unwind: {
        path: "$products",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "products.product",
        pipeline: [...productData(language)],
      },
    },
    {
      $unwind: {
        path: "$products.product",
      },
    },
    {
      $group: {
        _id: null,
        products: { $push: "$products" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];
};
