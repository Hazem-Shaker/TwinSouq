"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../shared/middlewares/auth");
const favorite_controller_1 = require("./favorite.controller");
const pagination_1 = __importDefault(require("../../shared/middlewares/pagination"));
class FavoriteRouter {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
        this.favoriteController = new favorite_controller_1.FavoriteController(this.favoriteService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.get("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), pagination_1.default, this.favoriteController.listFavorites.bind(this.favoriteController));
        router.put("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.favoriteController.addToFavorites.bind(this.favoriteController));
        router.delete("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.favoriteController.removeFromFavorites.bind(this.favoriteController));
        return router;
    }
}
exports.FavoriteRouter = FavoriteRouter;
