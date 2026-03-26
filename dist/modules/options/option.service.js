"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionService = void 0;
const create_1 = require("./create");
const list_by_category_id_1 = require("./list-by-category-id");
const update_1 = require("./update");
const get_for_admin_1 = require("./get-for-admin");
const delete_1 = require("./delete");
class OptionService {
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.createOptionLogic = new create_1.CreateOptionLogic(this.categoryService);
        this.listByCategoryIdLogic = new list_by_category_id_1.ListByCategoryIdLogic();
        this.updateLogic = new update_1.UpdateLogic(this.categoryService);
        this.getForAdminLogic = new get_for_admin_1.GetForAdminLogic();
        this.deleteLogic = new delete_1.DeleteForAdminLogic();
    }
    createOption(data, language) {
        return this.createOptionLogic.create(data, language);
    }
    listByCategoryId(categoryId, language, forAdmin = false) {
        return this.listByCategoryIdLogic.list({ categoryId }, language, forAdmin);
    }
    updateOption(optionId, data, language) {
        return this.updateLogic.update(optionId, data, language);
    }
    getForAdmin(id, language) {
        return this.getForAdminLogic.list({ id }, language);
    }
    deleteOption(id) {
        return this.deleteLogic.delete({ id });
    }
}
exports.OptionService = OptionService;
