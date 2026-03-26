import { ProductService } from "../products/product.service";
import { CartRouter } from "./cart.router";
import { CartService } from "./cart.service";

export class CartModule {
  cartService: CartService;
  cartRouter: CartRouter;
  constructor(public productService: ProductService) {
    this.cartService = new CartService(this.productService);
    this.cartRouter = new CartRouter(this.cartService);
  }

  routerFactory() {
    return this.cartRouter.createRouter();
  }
}
