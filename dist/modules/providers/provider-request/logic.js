"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRequestLogic = void 0;
const provider_model_1 = __importDefault(require("../provider.model"));
const input_1 = require("./input");
const aggregations_1 = require("../../../shared/utils/aggregations");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const files_1 = require("../../../shared/utils/files");
class ProviderRequestLogic {
    async createProviderRequest(input, language = "en") {
        const data = input_1.inputSchema.parse(input);
        const existingProvider = await provider_model_1.default.findOne({
            user: data.user,
        });
        if (existingProvider) {
            throw new custom_errors_1.InvalidCredentialsError("provider_exists");
        }
        const newProvider = await provider_model_1.default.create({
            ...data,
            idImage: {
                front: data.idImageFront[0]._id,
                back: data.idImageBack[0]._id,
            },
            photo: data.photo[0]._id,
        });
        await (0, files_1.markFilesAsUsed)([
            newProvider.idImage.front,
            newProvider.idImage.back,
            newProvider.photo,
        ]);
        return newProvider;
    }
    async listProviderRequests(query, pagination) {
        console.log(pagination);
        pagination = input_1.paginationSchema.parse(pagination);
        query = input_1.querySchema.parse(query);
        const sort = { createdAt: -1 };
        const filters = query.filter ? query.filter : "";
        const providers = await provider_model_1.default.aggregate([
            {
                $match: { isVerified: false },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    {
                                        name: {
                                            $regex: filters,
                                            $options: "i",
                                        },
                                    },
                                    {
                                        name: {
                                            $regex: filters,
                                            $options: "i",
                                        },
                                    },
                                ],
                            },
                        },
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
            {
                $unwind: { path: "$user" },
            },
            {
                $sort: sort,
            },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            ...(0, aggregations_1.imageAggregate)("idImage.front", true),
            ...(0, aggregations_1.imageAggregate)("idImage.back", true),
            ...(0, aggregations_1.imageAggregate)("photo", true),
        ]);
        return providers;
    }
    async getProviderRequest(input) {
        input = input_1.getProviderRequestInputSchema.parse(input);
        const { providerRequestId } = input;
        const provider = await provider_model_1.default.aggregate([
            {
                $match: {
                    _id: providerRequestId,
                },
            },
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
            {
                $unwind: { path: "$user" },
            },
            ...(0, aggregations_1.imageAggregate)("idImage.front", true),
            ...(0, aggregations_1.imageAggregate)("idImage.back", true),
            ...(0, aggregations_1.imageAggregate)("photo", true),
        ]);
        if (!provider.length) {
            throw new custom_errors_1.InvalidCredentialsError("Provider not found.");
        }
        return provider[0];
    }
    async acceptProviderRequest(input) {
        input = input_1.acceptProviderRequestInputSchema.parse(input);
        const { providerRequestId } = input;
        const provider = await provider_model_1.default.findById(providerRequestId);
        if (!provider) {
            throw new custom_errors_1.InvalidCredentialsError("Provider not found.");
        }
        provider.isVerified = true;
        await provider.save();
        return await this.getProviderRequest({ providerRequestId });
    }
    async rejectProviderRequest(input, session) {
        input = input_1.rejectProviderRequestInputSchema.parse(input);
        const { providerRequestId } = input;
        const provider = await provider_model_1.default.findByIdAndDelete(providerRequestId, {
            session,
        });
        if (!provider) {
            throw new custom_errors_1.InvalidCredentialsError("Provider not found.");
        }
        return provider;
    }
}
exports.ProviderRequestLogic = ProviderRequestLogic;
