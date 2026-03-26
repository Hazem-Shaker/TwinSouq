import { imageAggregate } from "./images";

export const aggregateForProvider = (language: string = "en") => {
  const projection: any[] = [];
  if (language === "en") {
    projection.push({
      $project: {
        key: "$id",
        name: "$name_en",
        slug: "$slug_en",
        value: {
          name: "$value.name_en",
          id: 1,
        },
      },
    });
  }
  if (language === "ar") {
    projection.push({
      $project: {
        key: "$id",
        name: "$name_ar",
        slug: "$slug_ar",
        value: {
          name: "$value.name_ar",
          id: 1,
        },
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
      $project: {
        optionsDetails: 0,
      },
    },
  ];
};
