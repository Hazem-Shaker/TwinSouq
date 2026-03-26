import { Request, Response, NextFunction } from "express";
import { OptionService } from "./option.service";

export class OptionController {
  private optionService: OptionService;

  constructor(optionService: OptionService) {
    this.optionService = optionService;
  }

  /**
   * Create a new option.
   */
  async createOption(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.optionService.createOption(
        req.body,
        req.language
      );
      res.sendSuccess(req.t("option.created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List options by category ID.
   */
  async listByCategoryId(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.optionService.listByCategoryId(
        req.params.categoryId,
        req.language
      );
      res.sendSuccess(req.t("option.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async listByCategoryIdForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.optionService.listByCategoryId(
        req.params.categoryId,
        req.language,
        true
      );
      res.sendSuccess(req.t("option.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an option by its ID.
   */
  async updateOption(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.optionService.updateOption(
        req.params.id,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("option.updated"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.optionService.getForAdmin(
        req.params.id,
        req.language
      );
      res.sendSuccess(req.t("option.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteOption(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.optionService.deleteOption(
        req.params.id,
      );
      res.sendSuccess(req.t("option.deleted"), response, 204);
    } catch (error) {
      next(error);
    }
  }
}
