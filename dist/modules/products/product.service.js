"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const create_1 = require("./provider/create");
const create_product_variant_1 = require("./provider/create-product-variant");
const update_1 = require("./provider/update");
const update_product_variant_1 = require("./provider/update-product-variant");
const list_product_variants_1 = require("./provider/list-product-variants");
const list_1 = require("./provider/list");
const get_1 = require("./provider/get");
const delete_1 = require("./provider/delete");
const publish_product_1 = require("./provider/publish-product");
const list_2 = require("./user/list");
const get_2 = require("./user/get");
const update_variant_quantity_1 = require("./update-variant-quantity");
const product_model_1 = __importDefault(require("./product.model"));
const variant_model_1 = __importDefault(require("./product-variants/variant.model"));
const custom_errors_1 = require("../../shared/utils/custom-errors");
class ProductService {
    constructor(categoryService, optionService, providerService) {
        this.categoryService = categoryService;
        this.optionService = optionService;
        this.providerService = providerService;
        this.categoryService = categoryService;
        this.optionService = optionService;
        this.createProductLogic = new create_1.CreaetProductLogic(this.optionService);
        this.createProductVariantLogic = new create_product_variant_1.CreateProductVariantLogic(this.optionService);
        this.updateProductLogic = new update_1.UpdateProductLogic(this.optionService);
        this.updateProductVariantLogic = new update_product_variant_1.UpdateProductVariantLogic();
        this.listProductVariantsLogic = new list_product_variants_1.ListProductVariantsLogic();
        this.listProductForProviderLogic = new list_1.ListProductsForProviderLogic();
        this.getProductDetailForProviderLogic =
            new get_1.GetProductDetailForProviderLogic();
        this.deleteProductLogic = new delete_1.DeleteProductLogic();
        this.listProductForUserLogic = new list_2.ListProductsForUserLogic(this.categoryService);
        this.getProductForUserLogic = new get_2.GetProductForUserLogic(this.providerService);
        this.publishProductLogic = new publish_product_1.PublishProductLogic();
        this.updateVariantQuantityLogic = new update_variant_quantity_1.UpdateVariantQuantityLogic();
    }
    createProduct(product, user, provider, language) {
        return this.createProductLogic.create({ ...product, provider }, language);
    }
    createProductVariant(data, user, provider, language) {
        return this.createProductVariantLogic.create(data, provider, language);
    }
    getProductForProvider(provider, product, language) {
        console.log("khaled waleed atia");
        return this.getProductDetailForProviderLogic.get({ provider, product }, language);
    }
    listProductForProvider(provider, pagination, query, language) {
        return this.listProductForProviderLogic.list({ provider, pagination, query }, language);
    }
    updateProduct(productId, data, provider, user, language) {
        return this.updateProductLogic.update(productId, provider, data, language);
    }
    deleteProduct(productId, provider, language) {
        return this.deleteProductLogic.remove({ id: productId, provider }, language);
    }
    updateProductVariant(variantId, data, provider, language) {
        return this.updateProductVariantLogic.update({ variantId, data, provider }, language);
    }
    listProductVariants(product, provider, pagination, language) {
        return this.listProductVariantsLogic.list({ product, provider, pagination }, language);
    }
    autoComplete(search) {
        return null;
    }
    list(pagination, query, user, language) {
        return this.listProductForUserLogic.list({ pagination, query, user }, language);
    }
    getProductForUser(id, query, user, language) {
        return this.getProductForUserLogic.get({ id, query, user }, language);
    }
    publishProduct(id, provider) {
        return this.publishProductLogic.execute({ id, provider });
    }
    getVariantData(id, product) {
        return variant_model_1.default.findOne({
            _id: id,
            product: product,
        });
    }
    async addReview(id, rating) {
        const product = await product_model_1.default.findById(id);
        if (!product)
            return false;
        const newCount = product.reviewsCount + 1;
        const newRating = (product.rating * product.reviewsCount + rating) / newCount;
        await product_model_1.default.findByIdAndUpdate(id, {
            reviewsCount: newCount,
            rating: newRating,
        });
        await this.providerService.addReview(product.provider, rating);
        return true;
    }
    decreaseStock(data, session) {
        return this.updateVariantQuantityLogic.decrease(data, session);
    }
    rollbackStock(data) {
        return this.updateVariantQuantityLogic.rollback(data);
    }
    async getForInstallmentsOrder(id, variant) {
        const variantObj = await variant_model_1.default.findOne({ product: id, _id: variant });
        if (!variantObj) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        const product = await product_model_1.default.aggregate([
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
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        return {
            variant: variantObj,
            product: product[0],
        };
    }
}
exports.ProductService = ProductService;
