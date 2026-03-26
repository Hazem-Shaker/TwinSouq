import { CategoryService } from "./category.service";
import { CategoryRouter } from "./category.router";

export class CategoryModule {
  categoryService: CategoryService;
  categoryRouter: CategoryRouter;

  constructor() {
    this.categoryService = new CategoryService();
    this.categoryRouter = new CategoryRouter(this.categoryService);
  }

  routerFactory() {
    return this.categoryRouter.createRouter();
  }
}