import { ProviderRequestLogic } from "./provider-request";
import { FileService } from "../../modules/File/file.service";
import mongoose from "mongoose";
import { InternalServerError } from "../../shared/utils/custom-errors";
import { ProviderStatsLogic } from "./stats/logic";
import ProviderViews from "./providerViews.model";
import Provider from "./provider.model";
import { ProviderHomePageLogic } from "./home-page";
export class ProviderService {
  private providerRequestLogic: ProviderRequestLogic;
  private providerStatsLogic: ProviderStatsLogic;
  private providerHomePageLogic: ProviderHomePageLogic;
  constructor(fileService: FileService) {
    this.providerRequestLogic = new ProviderRequestLogic();
    this.providerStatsLogic = new ProviderStatsLogic();
    this.providerHomePageLogic = new ProviderHomePageLogic();
  }

  async createProviderRequest(data: any, user: string, language: string) {
    return this.providerRequestLogic.createProviderRequest(
      { ...data, user },
      language
    );
  }

  listProviderRequests(query: any, pagination: any) {
    return this.providerRequestLogic.listProviderRequests(query, pagination);
  }

  getProviderRequest(input: any) {
    return this.providerRequestLogic.getProviderRequest(input);
  }

  acceptProviderRequest(input: any) {
    return this.providerRequestLogic.acceptProviderRequest(input);
  }

  async increaseProviderViews(
    provider: mongoose.Schema.Types.ObjectId,
    user: mongoose.Types.ObjectId
  ) {
    const view = await ProviderViews.findOne({
      provider,
      user,
    });

    if (view) {
      return null;
    }

    await ProviderViews.create({
      provider,
      user,
    });

    await Provider.findByIdAndUpdate(provider, {
      $inc: { views: 1 },
    });
  }

  async rejectProviderRequest(input: any) {
    return;
  }

  async getProviderStats(provider: any) {
    return this.providerStatsLogic.execute({ provider });
  }

  async getProviderHomePage(provider: any) {
    return this.providerHomePageLogic.execute({ provider });
  }

  async addReview(id: mongoose.Schema.Types.ObjectId, rating: number) {
    const provider = await Provider.findById(id);
    if (!provider) return false;
    const newCount = provider.reviewsCount + 1;
    const newRating =
      (provider.rating * provider.reviewsCount + rating) / newCount;

    await Provider.findByIdAndUpdate(id, {
      reviewsCount: newCount,
      rating: newRating,
    });
    return true;
  }
}
