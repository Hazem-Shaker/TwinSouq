"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLogic = void 0;
const settings_model_1 = __importDefault(require("../settings.model"));
const aggregations_1 = require("../../../shared/utils/aggregations");
class GetLogic {
    async get(language = "en") {
        const existSettings = await settings_model_1.default.findOne({});
        if (!existSettings) {
            await settings_model_1.default.create({});
        }
        const select = (name) => `$${name}.${language}`;
        const settings = await settings_model_1.default.aggregate([
            ...(0, aggregations_1.imageAggregate)("footerLogo", true),
            ...(0, aggregations_1.imageAggregate)("headerLogo", true),
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
exports.GetLogic = GetLogic;
