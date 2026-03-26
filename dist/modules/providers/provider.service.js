"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const provider_request_1 = require("./provider-request");
const logic_1 = require("./stats/logic");
const providerViews_model_1 = __importDefault(require("./providerViews.model"));
const provider_model_1 = __importDefault(require("./provider.model"));
const home_page_1 = require("./home-page");
class ProviderService {
    constructor(fileService) {
        this.providerRequestLogic = new provider_request_1.ProviderRequestLogic();
        this.providerStatsLogic = new logic_1.ProviderStatsLogic();
        this.providerHomePageLogic = new home_page_1.ProviderHomePageLogic();
    }
    async createProviderRequest(data, user, language) {
        return this.providerRequestLogic.createProviderRequest({ ...data, user }, language);
    }
    listProviderRequests(query, pagination) {
        return this.providerRequestLogic.listProviderRequests(query, pagination);
    }
    getProviderRequest(input) {
        return this.providerRequestLogic.getProviderRequest(input);
    }
    acceptProviderRequest(input) {
        return this.providerRequestLogic.acceptProviderRequest(input);
    }
    async increaseProviderViews(provider, user) {
        const view = await providerViews_model_1.default.findOne({
            provider,
            user,
        });
        if (view) {
            return null;
        }
        await providerViews_model_1.default.create({
            provider,
            user,
        });
        await provider_model_1.default.findByIdAndUpdate(provider, {
            $inc: { views: 1 },
        });
    }
    async rejectProviderRequest(input) {
        return;
    }
    async getProviderStats(provider) {
        return this.providerStatsLogic.execute({ provider });
    }
    async getProviderHomePage(provider) {
        return this.providerHomePageLogic.execute({ provider });
    }
    async addReview(id, rating) {
        const provider = await provider_model_1.default.findById(id);
        if (!provider)
            return false;
        const newCount = provider.reviewsCount + 1;
        const newRating = (provider.rating * provider.reviewsCount + rating) / newCount;
        await provider_model_1.default.findByIdAndUpdate(id, {
            reviewsCount: newCount,
            rating: newRating,
        });
        return true;
    }
}
exports.ProviderService = ProviderService;
