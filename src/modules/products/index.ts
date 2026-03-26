import { FileService } from "../File/file.service";
import { ProductRouter } from "./product.router";
import { ProductService } from "./product.service";
import { OptionService } from "../options/option.service";
import { CategoryService } from "../categories/category.service";
import { ProviderService } from "../providers/provider.service";

export class ProductModule {
  productService: ProductService;
  productRouter: ProductRouter;

  constructor(
    private categoryService: CategoryService,
    private optionService: OptionService,
    private providerService: ProviderService
  ) {
    this.optionService = optionService;
    this.categoryService = categoryService;
    this.productService = new ProductService(
      this.categoryService,
      this.optionService,
      this.providerService
    );
    this.productRouter = new ProductRouter(this.productService);
  }

  routerFactory() {
    return this.productRouter.createRouter();
  }
}
