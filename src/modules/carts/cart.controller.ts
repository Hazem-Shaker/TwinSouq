import { NextFunction, Request, Response } from "express";
import { CartService } from "./cart.service";
import { InstallmentsCartService } from "./installmentsCart/installmentsCart.service";

export class CartController {
  private installmentsCartService: InstallmentsCartService;
  constructor(public cartService: CartService) {
    this.installmentsCartService = new InstallmentsCartService();
  }

  async addProductToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, body } = req;
      const response = await this.cartService.addProductToCart(
        user.id,
        body,
        req.language
      );
      res.sendSuccess(req.t("cart.updated"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.cartService.getCart(user.id, req.language);
      res.sendSuccess(req.t("cart.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async addToInstallmentCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.installmentsCartService.addToCart(
        {
          user: user.id as any,
          ...req.body,
        },
        req.language
      );
      res.sendSuccess(req.t("cart.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async removeFromInstallmentCart(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user } = req;
      const response = await this.installmentsCartService.removeFromCart(
        {
          user: user.id as any,
          product: req.params.product as any,
        },
        req.language
      );
      res.sendSuccess(req.t("cart.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getInstallmentCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.installmentsCartService.getCart(
        { user: user.id as any },
        req.language
      );
      res.sendSuccess(req.t("cart.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }
}
