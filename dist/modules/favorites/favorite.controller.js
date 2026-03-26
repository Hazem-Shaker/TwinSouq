"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }
    async addToFavorites(req, res, next) {
        try {
            const response = await this.favoriteService.add({
                ...req.body,
                user: req.user.id,
            });
            res.sendSuccess(req.t("favorites.added"), response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async removeFromFavorites(req, res, next) {
        try {
            const response = await this.favoriteService.remove({
                ...req.body,
                user: req.user.id,
            });
            res.sendSuccess(req.t("favorites.removed"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async listFavorites(req, res, next) {
        try {
            const response = await this.favoriteService.listFavorites({ user: req.user.id, pagination: req.pagination }, req.language);
            res.sendSuccess(req.t("favorites.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FavoriteController = FavoriteController;
