import { OptionRouter } from "./option.router";
import { OptionService } from "./option.service";
import { CategoryService } from "../categories/category.service";
export class OptionModule {
  optionService: OptionService;
  optionRouter: OptionRouter;

  constructor(private categoryService: CategoryService) {
    this.optionService = new OptionService(this.categoryService);
    this.optionRouter = new OptionRouter(this.optionService);
  }

  routerFactory() {
    return this.optionRouter.createRouter();
  }
}
