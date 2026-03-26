"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningService = void 0;
const earning_model_1 = __importDefault(require("./earning.model"));
const providerBalance_model_1 = __importDefault(require("./providerBalance.model"));
const payout_model_1 = __importDefault(require("./payout.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const scheduler_1 = require("../../shared/scheduler");
const updateEarningStatusJob_1 = require("./jobs/updateEarningStatusJob");
const input_1 = require("./input");
const custom_errors_1 = require("../../shared/utils/custom-errors");
const aggregations_1 = require("../../shared/utils/aggregations");
class EarningService {
    constructor() { }
    async createOrderEarning(input, session) {
        try {
            input = input_1.createOrderEarningInputSchema.parse(input);
            const earning = (await earning_model_1.default.create({
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
            }));
            const walletExits = await providerBalance_model_1.default.findOne({
                provider: input.provider,
            });
            if (!walletExits) {
                await providerBalance_model_1.default.create({ provider: input.provider });
            }
            if (input.status === "pending") {
                await providerBalance_model_1.default.findOneAndUpdate({ provider: input.provider }, { $inc: { pendingBalance: input.amount } }, { new: true, session });
            }
            else if (input.status === "available") {
                await providerBalance_model_1.default.findOneAndUpdate({ provider: input.provider }, { $inc: { availableBalance: input.amount } }, { new: true, session });
            }
            else if (input.status === "withdrawn") {
                await providerBalance_model_1.default.findOneAndUpdate({ provider: input.provider }, { $inc: { totalWithdrawn: input.amount } }, { new: true, session });
            }
            await (0, scheduler_1.scheduleJob)(updateEarningStatusJob_1.JOB_NAME, "in 5 days", {
                earningId: earning._id.toString(),
            });
            return earning;
        }
        catch (error) {
            throw error;
        }
    }
    async createInstallmentEarning(input, session) {
        try {
            input = input_1.createInstallmentEarningInputSchema.parse(input);
            const earning = (await earning_model_1.default.create({
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
            }));
            const walletExits = await providerBalance_model_1.default.findOne({
                provider: input.provider,
            });
            if (!walletExits) {
                await providerBalance_model_1.default.create({ provider: input.provider });
            }
            if (input.status === "pending") {
                await providerBalance_model_1.default.findOneAndUpdate({ provider: input.provider }, { $inc: { pendingBalance: input.amount } }, { new: true, session });
            }
            else if (input.status === "available") {
                await providerBalance_model_1.default.findOneAndUpdate({ provider: input.provider }, { $inc: { availableBalance: input.amount } }, { new: true, session });
            }
            else if (input.status === "withdrawn") {
                await providerBalance_model_1.default.findOneAndUpdate({ provider: input.provider }, { $inc: { totalWithdrawn: input.amount } }, { new: true, session });
            }
            await (0, scheduler_1.scheduleJob)(updateEarningStatusJob_1.JOB_NAME, "in 5 days", {
                earningId: earning._id.toString(),
            });
            return earning;
        }
        catch (error) {
            throw error;
        }
    }
    async getWalletBalance(input) {
        input = input_1.getWalletBalanceInputSchema.parse(input);
        const walletBalance = await providerBalance_model_1.default.findOne({
            provider: input.provider,
        });
        if (!walletBalance) {
            await providerBalance_model_1.default.create({ provider: input.provider });
        }
        return (await providerBalance_model_1.default.aggregate([
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
        ]))[0];
    }
    async withdrawEarning(input) {
        input = input_1.withdrawInputSchema.parse(input);
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const wallet = await providerBalance_model_1.default.findOne({
                provider: input.provider,
            });
            if (!wallet) {
                throw new custom_errors_1.NotFoundError("wallet_not_found");
            }
            if (wallet.availableBalance === 0) {
                throw new custom_errors_1.BadRequestError("no_available_balance");
            }
            const payout = new payout_model_1.default({
                provider: input.provider,
                amount: wallet.availableBalance,
                iban: input.iban,
                status: "pending",
            });
            await payout.save({ session });
            await earning_model_1.default.updateMany({ provider: input.provider, status: "available" }, { $set: { withdrawRequest: payout._id } }, { session });
            await session.commitTransaction();
            return payout;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async confirmPayout(input) {
        input = input_1.confirmPayoutInputSchema.parse(input);
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const payout = await payout_model_1.default.findById(input.payout);
            if (!payout) {
                throw new custom_errors_1.NotFoundError("payout_not_found");
            }
            await payout_model_1.default.findByIdAndUpdate(input.payout, { $set: { status: "paid" } }, { session });
            await earning_model_1.default.updateMany({ withdrawRequest: payout._id }, { $set: { status: "withdrawn" } }, { session });
            await providerBalance_model_1.default.findOneAndUpdate({ provider: payout.provider }, {
                $inc: {
                    totalWithdrawn: payout.amount,
                    availableBalance: -payout.amount,
                },
            }, { new: true, session });
            await session.commitTransaction();
            return payout;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async getPayoutsForAdmin(input) {
        input = input_1.getPayoutsForAdminInputSchema.parse(input);
        const { limit, skip, page } = input.pagination;
        const { status } = input.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        const payouts = await payout_model_1.default.aggregate([
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
                        ...(0, aggregations_1.imageAggregate)("photo"),
                        ...(0, aggregations_1.imageAggregate)("idImage.front"),
                        ...(0, aggregations_1.imageAggregate)("idImage.back"),
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
        const totalCount = await payout_model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
        return {
            results: payouts,
            totalCount,
            totalPages,
            currentPage: page,
        };
    }
}
exports.EarningService = EarningService;
