import { FavoriteService } from "./favorite.service";
import { FavoriteRouter } from "./favorite.router";

export class FavoriteModule {
  private favoriteRouter: FavoriteRouter;
  favoriteService: FavoriteService;
  constructor() {
    this.favoriteService = new FavoriteService();
    this.favoriteRouter = new FavoriteRouter(this.favoriteService);
  }

  routerFactory() {
    return this.favoriteRouter.createRouter();
  }
}
