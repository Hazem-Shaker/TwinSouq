import { UpdateLogic } from "./update";
import { GetLogic } from "./get";
import { ListLogic } from "./list";
import { GetLogicForAdmin } from "./admin-get";
import { ListLogicForAdmin } from "./admin-list";
import { DeleteLogic } from "./delete";
import { CreateLogic } from "./create";
import mongoose from "mongoose";
import Category from "./category.model";
import { NotFoundError } from "../../shared/utils/custom-errors";

export class CategoryService {
  updateLogic: UpdateLogic;
  getLogic: GetLogic;
  listLogic: ListLogic;
  getLogicForAdmin: GetLogicForAdmin;
  listLogicForAdmin: ListLogicForAdmin;
  deleteLogic: DeleteLogic;
  createLogic: CreateLogic;

  constructor() {
    this.createLogic = new CreateLogic();
    this.deleteLogic = new DeleteLogic();
    this.listLogic = new ListLogic();
    this.listLogicForAdmin = new ListLogicForAdmin();
    this.getLogic = new GetLogic();
    this.updateLogic = new UpdateLogic();
    this.getLogicForAdmin = new GetLogicForAdmin();
  }

  deleteCategory(slug: string) {
    return this.deleteLogic.delete(slug);
  }

  updateCategory(id: any, data: any, language: string) {
    return this.updateLogic.update({ id, data }, language);
  }

  listCategories(pagination: any, query: any, language: string) {
    return this.listLogic.list(pagination, query, language);
  }

  listCategoriesForAdmin(query: object, filter: string) {
    return this.listLogicForAdmin.listForAdmin(query, filter);
  }

  getCategoryForAdmin(id: any) {
    return this.getLogicForAdmin.getForAdmin({ id });
  }

  getCategory(slug: string, language: string) {
    return this.getLogic.get(slug, language);
  }

  createCategory(data: any, language: string) {
    return this.createLogic.create(data, language);
  }

  async getChildernIds(parent: mongoose.Types.ObjectId) {
    const categories = await Category.find({ parent });
    return categories.map((cat) => cat._id as any as mongoose.Types.ObjectId);
  }

  async getForOptions(categoryId: mongoose.Schema.Types.ObjectId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new NotFoundError("category_not_found");
    }
    return category;
  }
}
