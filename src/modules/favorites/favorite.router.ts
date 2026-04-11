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


    /**
     * @openapi
     * /api/favorites:
     *   get:
     *     tags: [Favorites]
     *     summary: GET /
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      paginationMiddleware,
      this.favoriteController.listFavorites.bind(this.favoriteController)
    );


    /**
     * @openapi
     * /api/favorites:
     *   put:
     *     tags: [Favorites]
     *     summary: PUT /
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.favoriteController.addToFavorites.bind(this.favoriteController)
    );


    /**
     * @openapi
     * /api/favorites:
     *   delete:
     *     tags: [Favorites]
     *     summary: DELETE /
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.favoriteController.removeFromFavorites.bind(this.favoriteController)
    );

    return router;
  }
}
