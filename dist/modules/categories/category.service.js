"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const update_1 = require("./update");
const get_1 = require("./get");
const list_1 = require("./list");
const admin_get_1 = require("./admin-get");
const admin_list_1 = require("./admin-list");
const delete_1 = require("./delete");
const create_1 = require("./create");
const category_model_1 = __importDefault(require("./category.model"));
const custom_errors_1 = require("../../shared/utils/custom-errors");
class CategoryService {
    constructor() {
        this.createLogic = new create_1.CreateLogic();
        this.deleteLogic = new delete_1.DeleteLogic();
        this.listLogic = new list_1.ListLogic();
        this.listLogicForAdmin = new admin_list_1.ListLogicForAdmin();
        this.getLogic = new get_1.GetLogic();
        this.updateLogic = new update_1.UpdateLogic();
        this.getLogicForAdmin = new admin_get_1.GetLogicForAdmin();
    }
    deleteCategory(slug) {
        return this.deleteLogic.delete(slug);
    }
    updateCategory(id, data, language) {
        return this.updateLogic.update({ id, data }, language);
    }
    listCategories(pagination, query, language) {
        return this.listLogic.list(pagination, query, language);
    }
    listCategoriesForAdmin(query, filter) {
        return this.listLogicForAdmin.listForAdmin(query, filter);
    }
    getCategoryForAdmin(id) {
        return this.getLogicForAdmin.getForAdmin({ id });
    }
    getCategory(slug, language) {
        return this.getLogic.get(slug, language);
    }
    createCategory(data, language) {
        return this.createLogic.create(data, language);
    }
    async getChildernIds(parent) {
        const categories = await category_model_1.default.find({ parent });
        return categories.map((cat) => cat._id);
    }
    async getForOptions(categoryId) {
        const category = await category_model_1.default.findById(categoryId);
        if (!category) {
            throw new custom_errors_1.NotFoundError("category_not_found");
        }
        return category;
    }
}
exports.CategoryService = CategoryService;
