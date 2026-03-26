import Provider from "../provider.model";
import {
  Input,
  inputSchema,
  Pagination,
  paginationSchema,
  Query,
  querySchema,
  AcceptProviderRequestInput,
  GetProviderRequestInput,
  RejectProviderRequestInput,
  acceptProviderRequestInputSchema,
  getProviderRequestInputSchema,
  rejectProviderRequestInputSchema,
} from "./input";
import { imageAggregate } from "../../../shared/utils/aggregations";
import mongoose, { mongo } from "mongoose";
import { config } from "../../../shared/config";
import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import { markFilesAsUsed } from "../../../shared/utils/files";

export class ProviderRequestLogic {
  async createProviderRequest(input: Input, language: string = "en") {
    const data = inputSchema.parse(input);

    const existingProvider = await Provider.findOne({
      user: data.user,
    });

    if (existingProvider) {
      throw new InvalidCredentialsError("provider_exists");
    }

    const newProvider = await Provider.create({
      ...data,
      idImage: {
        front: data.idImageFront[0]._id,
        back: data.idImageBack[0]._id,
      },
      photo: data.photo[0]._id,
    });

    await markFilesAsUsed([
      newProvider.idImage.front,
      newProvider.idImage.back,
      newProvider.photo,
    ]);

    return newProvider;
  }

  async listProviderRequests(query: Query, pagination: Pagination) {
    console.log(pagination);
    pagination = paginationSchema.parse(pagination);
    query = querySchema.parse(query);
    const sort: {
      [key: string]: -1 | 1;
    } = { createdAt: -1 };
    const filters = query.filter ? query.filter : "";
    const providers = await Provider.aggregate([
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
      ...imageAggregate("idImage.front", true),
      ...imageAggregate("idImage.back", true),
      ...imageAggregate("photo", true),
    ]);
    return providers;
  }

  async getProviderRequest(input: GetProviderRequestInput) {
    input = getProviderRequestInputSchema.parse(input);
    const { providerRequestId } = input;
    const provider = await Provider.aggregate([
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
      ...imageAggregate("idImage.front", true),
      ...imageAggregate("idImage.back", true),
      ...imageAggregate("photo", true),
    ]);

    if (!provider.length) {
      throw new InvalidCredentialsError("Provider not found.");
    }

    return provider[0];
  }

  async acceptProviderRequest(input: AcceptProviderRequestInput) {
    input = acceptProviderRequestInputSchema.parse(input);
    const { providerRequestId } = input;
    const provider = await Provider.findById(providerRequestId);
    if (!provider) {
      throw new InvalidCredentialsError("Provider not found.");
    }

    provider.isVerified = true;
    await provider.save();
    return await this.getProviderRequest({ providerRequestId });
  }

  async rejectProviderRequest(
    input: RejectProviderRequestInput,
    session: mongo.ClientSession
  ) {
    input = rejectProviderRequestInputSchema.parse(input);
    const { providerRequestId } = input;
    const provider = await Provider.findByIdAndDelete(providerRequestId, {
      session,
    });
    if (!provider) {
      throw new InvalidCredentialsError("Provider not found.");
    }
    return provider;
  }
}
