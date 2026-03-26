import { config } from "../../config";
import { unwindQuery } from "./unwind";

export const imageAggregate = (fieldName: string, unwind: boolean = true) => [
  {
    $lookup: {
      from: "files",
      localField: fieldName,
      foreignField: "_id",
      as: fieldName,
      pipeline: [
        {
          $project: {
            url: 1,
            _id: 0,
          },
        },
      ],
    },
  },
  ...unwindQuery(fieldName, unwind),
];
