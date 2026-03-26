import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";

export class ProductController {
  productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    const { body, user } = req;
    try {
      const response = await this.productService.createProduct(
        body,
        user.id,
        user.providerId ?? "",
        req.language
      );
      res.sendSuccess(req.t("product.created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async createProductVariant(req: Request, res: Response, next: NextFunction) {
    const { body, user } = req;
    const { id } = req.params;
    try {
      const response = await this.productService.createProductVariant(
        { ...body, product: id },
        user.id,
        user.providerId,
        req.language
      );
      res.sendSuccess(req.t("product.variant_created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async listProductsForProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { pagination, user, query } = req;
      const response = await this.productService.listProductForProvider(
        user.providerId,
        pagination,
        query,
        req.language
      );
      res.sendSuccess(req.t("product.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getProductForProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { user } = req;
      const response = await this.productService.getProductForProvider(
        user.providerId,
        id,
        req.language
      );
      res.sendSuccess(req.t("product.get"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async publishProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { user } = req;
      const response = await this.productService.publishProduct(
        id,
        user.providerId
      );
      res.sendSuccess(req.t("product.published"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { user } = req;
      const response = await this.productService.deleteProduct(
        id,
        user.providerId,
        req.language
      );
      res.sendSuccess(req.t("product.removed"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  // async getProduct(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { params } = req;
  //     const response = await this.productService.getProduct(params.productId);
  //     res.sendSuccess("Product fetched successfully", response, 200);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { body, user } = req;

      const response = await this.productService.updateProduct(
        productId,
        body,
        user.providerId,
        user.id,
        req.language
      );
      res.sendSuccess(req.t("product.updated"), response);
    } catch (error) {
      next(error);
    }
  }

  async updateProductVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user } = req;
      const { variantId } = req.params;
      const response = await this.productService.updateProductVariant(
        variantId,
        body,
        user.providerId,
        req.language
      );
      res.sendSuccess(req.t("product.variant_updated"), response);
    } catch (error) {
      next(error);
    }
  }

  async listProductVariants(req: Request, res: Response, next: NextFunction) {
    try {
      const { pagination } = req;
      const { id } = req.params;
      const response = await this.productService.listProductVariants(
        id,
        req.user.providerId,
        pagination,
        req.language
      );
      res.sendSuccess(req.t("product.variants_fetched"), response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // async autoComplete(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { search } = req.query;
  //     const response = await this.productService.autoComplete(
  //       (search as string) ?? ""
  //     );
  //     res.sendSuccess("Auto complete fetched successfully", response);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { pagination, query, user } = req;
      const response = await this.productService.list(
        pagination ?? {},
        query ?? {},
        user?.id ?? null,
        req.language
      );
      res.sendSuccess("product.fetched", response);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req;
      const { id } = req.params;
      const response = await this.productService.getProductForUser(
        id,
        query,
        req.user?.id ?? null,
        req.language
      );
      res.sendSuccess(req.t("product.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }
}
