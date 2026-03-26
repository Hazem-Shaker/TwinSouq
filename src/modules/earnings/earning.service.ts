import Earning from "./earning.model";
import ProviderBalance from "./providerBalance.model";
import Payout from "./payout.model";
import mongoose from "mongoose";
import { scheduleJob } from "../../shared/scheduler";
import { JOB_NAME as UPDATE_EARNING_STATUS_JOB_NAME } from "./jobs/updateEarningStatusJob";

import {
  CreateInstallmentEarningInput,
  CreateOrderEarningInput,
  createInstallmentEarningInputSchema,
  createOrderEarningInputSchema,
  getWalletBalanceInputSchema,
  GetWalletBalanceInput,
  WithdrawInput,
  withdrawInputSchema,
  confirmPayoutInputSchema,
  ConfirmPayoutInput,
  getPayoutsForAdminInputSchema,
  GetPayoutsForAdminInput,
} from "./input";
import {
  NotFoundError,
  BadRequestError,
} from "../../shared/utils/custom-errors";
import { imageAggregate } from "../../shared/utils/aggregations";

export class EarningService {
  constructor() {}

  async createOrderEarning(
    input: CreateOrderEarningInput,
    session: mongoose.ClientSession
  ) {
    try {
      input = createOrderEarningInputSchema.parse(input);
      const earning = (await Earning.create({
        provider: input.provider,
        type: "order",
        order: input.order,
        product: {
          id: input.product.id,
          variant: input.product.variant,
          price: input.product.price,
          quantity: input.product.quantity,
          profitPercent: input.product.profitPercent,
        },
        amount: input.amount,
        status: input.status,
      })) as mongoose.Document & { _id: mongoose.Types.ObjectId };

      const walletExits = await ProviderBalance.findOne({
        provider: input.provider,
      });

      if (!walletExits) {
        await ProviderBalance.create({ provider: input.provider });
      }

      if (input.status === "pending") {
        await ProviderBalance.findOneAndUpdate(
          { provider: input.provider },
          { $inc: { pendingBalance: input.amount } },
          { new: true, session }
        );
      } else if (input.status === "available") {
        await ProviderBalance.findOneAndUpdate(
          { provider: input.provider },
          { $inc: { availableBalance: input.amount } },
          { new: true, session }
        );
      } else if (input.status === "withdrawn") {
        await ProviderBalance.findOneAndUpdate(
          { provider: input.provider },
          { $inc: { totalWithdrawn: input.amount } },
          { new: true, session }
        );
      }

      await scheduleJob(UPDATE_EARNING_STATUS_JOB_NAME, "in 5 days", {
        earningId: earning._id.toString() as string,
      });

      return earning;
    } catch (error) {
      throw error;
    }
  }

  async createInstallmentEarning(
    input: CreateInstallmentEarningInput,
    session: mongoose.ClientSession
  ) {
    try {
      input = createInstallmentEarningInputSchema.parse(input);
      const earning = (await Earning.create({
        provider: input.provider,
        type: "installment",
        order: input.order,
        product: {
          id: input.product.id,
          variant: input.product.variant,
          price: input.product.price,
          quantity: 1,
          profitPercent: input.product.profitPercent,
        },
        amount: input.amount,
        status: input.status,
      })) as mongoose.Document & { _id: mongoose.Types.ObjectId };

      const walletExits = await ProviderBalance.findOne({
        provider: input.provider,
      });

      if (!walletExits) {
        await ProviderBalance.create({ provider: input.provider });
      }

      if (input.status === "pending") {
        await ProviderBalance.findOneAndUpdate(
          { provider: input.provider },
          { $inc: { pendingBalance: input.amount } },
          { new: true, session }
        );
      } else if (input.status === "available") {
        await ProviderBalance.findOneAndUpdate(
          { provider: input.provider },
          { $inc: { availableBalance: input.amount } },
          { new: true, session }
        );
      } else if (input.status === "withdrawn") {
        await ProviderBalance.findOneAndUpdate(
          { provider: input.provider },
          { $inc: { totalWithdrawn: input.amount } },
          { new: true, session }
        );
      }

      await scheduleJob(UPDATE_EARNING_STATUS_JOB_NAME, "in 5 days", {
        earningId: earning._id.toString() as string,
      });

      return earning;
    } catch (error) {
      throw error;
    }
  }

  async getWalletBalance(input: GetWalletBalanceInput) {
    input = getWalletBalanceInputSchema.parse(input);
    const walletBalance = await ProviderBalance.findOne({
      provider: input.provider,
    });
    if (!walletBalance) {
      await ProviderBalance.create({ provider: input.provider });
    }
    return (
      await ProviderBalance.aggregate([
        {
          $match: { provider: input.provider },
        },
        {
          $project: {
            _id: 0,
            availableBalance: 1,
            pendingBalance: 1,
            totalWithdrawn: 1,
            lastUpdated: {
              $dateToString: { format: "%d/%m/%Y", date: "$updatedAt" },
            },
          },
        },
      ])
    )[0];
  }

  async withdrawEarning(input: WithdrawInput) {
    input = withdrawInputSchema.parse(input);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const wallet = await ProviderBalance.findOne({
        provider: input.provider,
      });
      if (!wallet) {
        throw new NotFoundError("wallet_not_found");
      }

      if (wallet.availableBalance === 0) {
        throw new BadRequestError("no_available_balance");
      }
      const payout = new Payout({
        provider: input.provider,
        amount: wallet.availableBalance,
        iban: input.iban,
        status: "pending",
      });

      await payout.save({ session });

      await Earning.updateMany(
        { provider: input.provider, status: "available" },
        { $set: { withdrawRequest: payout._id } },
        { session }
      );

      await session.commitTransaction();
      return payout;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async confirmPayout(input: ConfirmPayoutInput) {
    input = confirmPayoutInputSchema.parse(input);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const payout = await Payout.findById(input.payout);
      if (!payout) {
        throw new NotFoundError("payout_not_found");
      }

      await Payout.findByIdAndUpdate(
        input.payout,
        { $set: { status: "paid" } },
        { session }
      );

      await Earning.updateMany(
        { withdrawRequest: payout._id },
        { $set: { status: "withdrawn" } },
        { session }
      );

      await ProviderBalance.findOneAndUpdate(
        { provider: payout.provider },
        {
          $inc: {
            totalWithdrawn: payout.amount,
            availableBalance: -payout.amount,
          },
        },
        { new: true, session }
      );

      await session.commitTransaction();
      return payout;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getPayoutsForAdmin(input: GetPayoutsForAdminInput) {
    input = getPayoutsForAdminInputSchema.parse(input);
    const { limit, skip, page } = input.pagination;
    const { status } = input.query;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const payouts = await Payout.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "providers",
          localField: "provider",
          foreignField: "_id",
          as: "provider",
          pipeline: [
            ...imageAggregate("photo"),
            ...imageAggregate("idImage.front"),
            ...imageAggregate("idImage.back"),
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },

            {
              $project: {
                id: "$_id",
                photo: 1,
                iban: 1,
                name: "$user.name",
                email: "$user.email",
                phone: "$user.phone",
                idImage: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      { $unwind: "$provider" },
      {
        $project: {
          id: "$_id",
          provider: 1,
          amount: 1,
          iban: 1,
          status: 1,
          requestDate: {
            $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
          },
          _id: 0,
        },
      },
    ]);

    const totalCount = await Payout.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      results: payouts,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }
}
