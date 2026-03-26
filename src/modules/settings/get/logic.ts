import { inputSchema, Input } from "./input";
import Setting from "../settings.model";
import { imageAggregate } from "../../../shared/utils/aggregations";

export class GetLogic {
  async get(language: string = "en") {
    const existSettings = await Setting.findOne({});

    if (!existSettings) {
      await Setting.create({});
    }
    const select = (name: string) => `$${name}.${language}`;
    const settings = await Setting.aggregate([
      ...imageAggregate("footerLogo", true),
      ...imageAggregate("headerLogo", true),
      {
        $set: {
          "seo.keywords": {
            $reduce: {
              input: "$seo.keywords",
              initialValue: "",
              in: {
                $cond: {
                  if: { $eq: ["$$value", ""] },
                  then: "$$this",
                  else: { $concat: ["$$value", ",", "$$this"] },
                },
              },
            },
          },
        },
      },
      {
        $set: {
          appName: select("appName"),
          appDescription: select("appDescription"),
          location: select("location"),
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    return settings[0];
  }
}
