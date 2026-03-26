"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModule = void 0;
const favorite_service_1 = require("./favorite.service");
const favorite_router_1 = require("./favorite.router");
class FavoriteModule {
    constructor() {
        this.favoriteService = new favorite_service_1.FavoriteService();
        this.favoriteRouter = new favorite_router_1.FavoriteRouter(this.favoriteService);
    }
    routerFactory() {
        return this.favoriteRouter.createRouter();
    }
}
exports.FavoriteModule = FavoriteModule;
