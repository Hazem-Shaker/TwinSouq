import mongoose, { mongo } from "mongoose";
import { CreaetProductLogic } from "./provider/create";
import { CategoryService } from "../categories/category.service";
import { OptionService } from "../options/option.service";
import { ProviderService } from "../providers/provider.service";
import { CreateProductVariantLogic } from "./provider/create-product-variant";
import { UpdateProductLogic } from "./provider/update";
import { UpdateProductVariantLogic } from "./provider/update-product-variant";
import { ListProductVariantsLogic } from "./provider/list-product-variants";
import { ListProductsForProviderLogic } from "./provider/list";
import { GetProductDetailForProviderLogic } from "./provider/get";
import { DeleteProductLogic } from "./provider/delete";
import { PublishProductLogic } from "./provider/publish-product";

import { ListProductsForUserLogic } from "./user/list";
import { GetProductForUserLogic } from "./user/get";

import { UpdateVariantQuantityLogic } from "./update-variant-quantity";

import Product from "./product.model";
import Variant from "./product-variants/variant.model";
import { NotFoundError } from "../../shared/utils/custom-errors";

export class ProductService {
  createProductLogic: CreaetProductLogic;
  createProductVariantLogic: CreateProductVariantLogic;
  updateProductLogic: UpdateProductLogic;
  updateProductVariantLogic: UpdateProductVariantLogic;
  listProductVariantsLogic: ListProductVariantsLogic;
  listProductForProviderLogic: ListProductsForProviderLogic;
  getProductDetailForProviderLogic: GetProductDetailForProviderLogic;
  deleteProductLogic: DeleteProductLogic;
  publishProductLogic: PublishProductLogic;

  listProductForUserLogic: ListProductsForUserLogic;
  getProductForUserLogic: GetProductForUserLogic;

  updateVariantQuantityLogic: UpdateVariantQuantityLogic;

  constructor(
    private categoryService: CategoryService,
    private optionService: OptionService,
    private providerService: ProviderService
  ) {
    this.categoryService = categoryService;
    this.optionService = optionService;

    this.createProductLogic = new CreaetProductLogic(this.optionService);
    this.createProductVariantLogic = new CreateProductVariantLogic(
      this.optionService
    );
    this.updateProductLogic = new UpdateProductLogic(this.optionService);
    this.updateProductVariantLogic = new UpdateProductVariantLogic();
    this.listProductVariantsLogic = new ListProductVariantsLogic();
    this.listProductForProviderLogic = new ListProductsForProviderLogic();
    this.getProductDetailForProviderLogic =
      new GetProductDetailForProviderLogic();
    this.deleteProductLogic = new DeleteProductLogic();

    this.listProductForUserLogic = new ListProductsForUserLogic(
      this.categoryService
    );
    this.getProductForUserLogic = new GetProductForUserLogic(
      this.providerService
    );
    this.publishProductLogic = new PublishProductLogic();

    this.updateVariantQuantityLogic = new UpdateVariantQuantityLogic();
  }

  createProduct(
    product: any,
    user: string,
    provider: string,
    language: string
  ) {
    return this.createProductLogic.create({ ...product, provider }, language);
  }

  createProductVariant(data: any, user: any, provider: any, language: any) {
    return this.createProductVariantLogic.create(data, provider, language);
  }

  getProductForProvider(provider: any, product: any, language: string) {
    console.log("khaled waleed atia");
    return this.getProductDetailForProviderLogic.get(
      { provider, product },
      language
    );
  }

  listProductForProvider(
    provider: any,
    pagination: any,
    query: any,
    language: string
  ) {
    return this.listProductForProviderLogic.list(
      { provider, pagination, query },
      language
    );
  }

  updateProduct(
    productId: any,
    data: any,
    provider: any,
    user: any,
    language: string
  ) {
    return this.updateProductLogic.update(productId, provider, data, language);
  }

  deleteProduct(productId: any, provider: any, language: string) {
    return this.deleteProductLogic.remove(
      { id: productId, provider },
      language
    );
  }

  updateProductVariant(
    variantId: any,
    data: any,
    provider: any,
    language: string
  ) {
    return this.updateProductVariantLogic.update(
      { variantId, data, provider },
      language
    );
  }

  listProductVariants(
    product: any,
    provider: any,
    pagination: any,
    language: string
  ) {
    return this.listProductVariantsLogic.list(
      { product, provider, pagination },
      language
    );
  }

  autoComplete(search: string) {
    return null;
  }

  list(pagination: any, query: any, user: any, language: string) {
    return this.listProductForUserLogic.list(
      { pagination, query, user },
      language
    );
  }

  getProductForUser(id: any, query: any, user: any, language: string) {
    return this.getProductForUserLogic.get({ id, query, user }, language);
  }

  publishProduct(id: any, provider: any) {
    return this.publishProductLogic.execute({ id, provider });
  }

  getVariantData(
    id: mongoose.Schema.Types.ObjectId,
    product: mongoose.Schema.Types.ObjectId
  ) {
    return Variant.findOne({
      _id: id,
      product: product,
    });
  }

  async addReview(id: mongoose.Types.ObjectId, rating: number) {
    const product = await Product.findById(id);
    if (!product) return false;
    const newCount = product.reviewsCount + 1;
    const newRating =
      (product.rating * product.reviewsCount + rating) / newCount;

    await Product.findByIdAndUpdate(id, {
      reviewsCount: newCount,
      rating: newRating,
    });
    await this.providerService.addReview(product.provider, rating);
    return true;
  }

  decreaseStock(data: any, session: mongo.ClientSession) {
    return this.updateVariantQuantityLogic.decrease(data, session);
  }

  rollbackStock(data: any) {
    return this.updateVariantQuantityLogic.rollback(data);
  }

  async getForInstallmentsOrder(
    id: mongoose.Schema.Types.ObjectId,
    variant: mongoose.Schema.Types.ObjectId
  ) {
    const variantObj = await Variant.findOne({ product: id, _id: variant });
    if (!variantObj) {
      throw new NotFoundError("product_not_found");
    }
    const product = await Product.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
        },
      },
      {
        $set: {
          profitPercent: "$category.profitPercentage",
        },
      },
    ]);

    if (!product.length) {
      throw new NotFoundError("product_not_found");
    }

    return {
      variant: variantObj,
      product: product[0],
    };
  }
}
