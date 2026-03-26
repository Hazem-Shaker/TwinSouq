import { imageAggregate } from "./images";
import { unwindQuery } from "./unwind";
export const categoryAggregation = (language: string) => {
  const agg: any[] = [
    ...imageAggregate("image", true),
    // aggregate parent data
    {
      $lookup: {
        from: "catgories",
        localField: "parent",
        foreignField: "_id",
        as: "parent",
      },
    },
    {
      $set: {
        id: "$_id",
      },
    },
  ];

  if (language === "en") {
    agg.push({
      $project: {
        id: 1,
        name: "$name_en",
        slug: "$slug_en",
        image: "$image.url",
        description: "$description_en",
      },
    });
  } else if (language === "ar") {
    agg.push({
      $project: {
        id: 1,
        name: "$name_ar",
        slug: "$slug_ar",
        image: "$image.url",
        description: "$description_ar",
      },
    });
  }

  return agg;
};
