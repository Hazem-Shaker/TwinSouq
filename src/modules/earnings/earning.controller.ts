import { EarningService } from "./earning.service";
import { Request, Response, NextFunction } from "express";
export class EarningController {
  constructor(private earningService: EarningService) {}

  async getWalletBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const walletBalance = await this.earningService.getWalletBalance({
        provider: req.user.providerId as any,
      });
      res.sendSuccess(req.t("wallet.fetched"), walletBalance, 200);
    } catch (error) {
      next(error);
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const payout = await this.earningService.withdrawEarning({
        provider: req.user.providerId as any,
        iban: req.body.iban,
      });
      res.sendSuccess(req.t("payout.created"), payout, 201);
    } catch (error) {
      next(error);
    }
  }

  async confirmPayout(req: Request, res: Response, next: NextFunction) {
    try {
      const payout = await this.earningService.confirmPayout({
        payout: req.params.id as any,
      });
      res.sendSuccess(req.t("payout.confirmed"), payout, 200);
    } catch (error) {
      next(error);
    }
  }

  async getPayoutsForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const payouts = await this.earningService.getPayoutsForAdmin({
        query: req.query,
        pagination: req.pagination as any,
      });
      res.sendSuccess(req.t("payouts.fetched"), payouts, 200);
    } catch (error) {
      next(error);
    }
  }
}
