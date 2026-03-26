import { Request, Response, NextFunction } from "express";
import { ProviderService } from "./provider.service";

export class ProviderController {
  private providerService: ProviderService;

  constructor(providerService: ProviderService) {
    this.providerService = providerService;
  }

  async createProviderRequest(req: Request, res: Response, next: NextFunction) {
    const { body, user } = req;
    try {
      const response = await this.providerService.createProviderRequest(
        body,
        user.id,
        req.language
      );
      res.sendSuccess("Provider request created successfully", response, 201);
    } catch (e) {
      console.log("khaled waleed mohamed atia");
      console.log(e);
      next(e);
    }
  }

  async listProviderRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, pagination } = req;
      const response = await this.providerService.listProviderRequests(
        query ?? {},
        pagination ?? {}
      );
      res.sendSuccess("Providers fetched successfully", response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getProviderRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = req;
      const response = await this.providerService.getProviderRequest(params);
      res.sendSuccess("Provider fetched successfully", response, 200);
    } catch (error) {
      next(error);
    }
  }

  async acceptProviderRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = req;
      const response = await this.providerService.acceptProviderRequest(params);
      res.sendSuccess("Provider accepted successfully", response, 200);
    } catch (error) {
      next(error);
    }
  }

  async rejectProviderRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = req;
      const response = await this.providerService.rejectProviderRequest(params);
      res.sendSuccess("Provider rejected successfully", response, 204);
    } catch (error) {
      next(error);
    }
  }

  async getProviderStats(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.providerService.getProviderStats(
        req.user.providerId
      );
      res.sendSuccess(req.t("provider.stats"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getProviderHomePage(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.providerService.getProviderHomePage(
        req.user.providerId
      );
      res.sendSuccess(req.t("provider.homePage"), response, 200);
    } catch (error) {
      next(error);
    }
  }
}
