import { Request, Response, NextFunction } from "express";
import { FavoriteService } from "./favorite.service";

export class FavoriteController {
  constructor(public favoriteService: FavoriteService) {}

  async addToFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.favoriteService.add({
        ...req.body,
        user: req.user.id,
      });
      res.sendSuccess(req.t("favorites.added"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async removeFromFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.favoriteService.remove({
        ...req.body,
        user: req.user.id,
      });
      res.sendSuccess(req.t("favorites.removed"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async listFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.favoriteService.listFavorites(
        { user: req.user.id as any, pagination: req.pagination as any },
        req.language
      );
      res.sendSuccess(req.t("favorites.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }
}
