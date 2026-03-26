import { CategoryService } from "./category.service";
import { Request, Response, NextFunction } from "express";

export class CategoryController {
  private categoryService: CategoryService;
  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoryService.createCategory(
        req.body,
        req.language
      );
      res.sendSuccess(req.t("category.created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoryService.getCategory(
        req.params.slug,
        req.language
      );
      res.sendSuccess("Category fetched successfully", response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoryService.getCategoryForAdmin(
        req.params.id
      );
      res.sendSuccess("Category fetched successfully", response, 200);
    } catch (error) {
      next(error);
    }
  }

  async listCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { pagination, query } = req;
      const response = await this.categoryService.listCategories(
        pagination ?? {},
        query ?? {},
        req.language
      );
      res.sendSuccess(req.t("category.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async listCategoriesForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { pagination, filter } = req;
      const response = await this.categoryService.listCategoriesForAdmin(
        pagination ?? {},
        req.query.filter as string
      );
      res.sendSuccess("Category fetched successfully", response, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoryService.updateCategory(
        req.params.id,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("category.updated"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoryService.deleteCategory(
        req.params.slug
      );
      res.sendSuccess("Category deleted successfully", response, 204);
    } catch (error) {
      next(error);
    }
  }
}
