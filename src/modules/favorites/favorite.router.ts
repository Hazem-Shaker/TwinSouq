import { Router } from "express";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";
import { FavoriteController } from "./favorite.controller";
import { FavoriteService } from "./favorite.service";
import paginationMiddleware from "../../shared/middlewares/pagination";

export class FavoriteRouter {
  private favoriteController: FavoriteController;
  private userAuthMiddleware: UserAuthMiddleware;
  constructor(public favoriteService: FavoriteService) {
    this.favoriteController = new FavoriteController(this.favoriteService);
    this.userAuthMiddleware = new UserAuthMiddleware();
  }

  createRouter() {
    const router = Router();

    router.get(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      paginationMiddleware,
      this.favoriteController.listFavorites.bind(this.favoriteController)
    );

    router.put(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.favoriteController.addToFavorites.bind(this.favoriteController)
    );

    router.delete(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.favoriteController.removeFromFavorites.bind(this.favoriteController)
    );

    return router;
  }
}
