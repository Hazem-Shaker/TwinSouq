"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningController = void 0;
class EarningController {
    constructor(earningService) {
        this.earningService = earningService;
    }
    async getWalletBalance(req, res, next) {
        try {
            const walletBalance = await this.earningService.getWalletBalance({
                provider: req.user.providerId,
            });
            res.sendSuccess(req.t("wallet.fetched"), walletBalance, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async withdraw(req, res, next) {
        try {
            const payout = await this.earningService.withdrawEarning({
                provider: req.user.providerId,
                iban: req.body.iban,
            });
            res.sendSuccess(req.t("payout.created"), payout, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async confirmPayout(req, res, next) {
        try {
            const payout = await this.earningService.confirmPayout({
                payout: req.params.id,
            });
            res.sendSuccess(req.t("payout.confirmed"), payout, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getPayoutsForAdmin(req, res, next) {
        try {
            const payouts = await this.earningService.getPayoutsForAdmin({
                query: req.query,
                pagination: req.pagination,
            });
            res.sendSuccess(req.t("payouts.fetched"), payouts, 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EarningController = EarningController;
