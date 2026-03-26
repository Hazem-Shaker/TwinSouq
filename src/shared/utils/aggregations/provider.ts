import { unwindQuery } from "./unwind";
import { imageAggregate } from "./images";
export const aggregateProvider = (detailed: boolean = false) => {
  const pipeline: any[] = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              user_id: "$_id",
              name: 1,
              email: 1,
              phone: 1,
              address: 1,
            },
          },
        ],
      },
    },
    ...unwindQuery("user", true),
    ...imageAggregate("idImage.front", true),
    ...imageAggregate("idImage.back", true),
    ...imageAggregate("photo", true),
  ];

  if (detailed === false) {
    pipeline.push({
      $project: {
        photo: 1,
        name: "$user.name",
        address: 1,
        email: "$user.email",
      },
    });
  }

  const query = [
    {
      $lookup: {
        from: "providers",
        localField: "provider",
        foreignField: "_id",
        as: "provider",
        pipeline,
      },
    },
    ...unwindQuery("provider", true),
  ];

  return query;
};
