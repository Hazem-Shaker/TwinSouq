import { CreateOptionLogic } from "./create";
import { ListByCategoryIdLogic } from "./list-by-category-id";
import { UpdateLogic } from "./update";
import { GetForAdminLogic } from "./get-for-admin";
import { CategoryService } from "../categories/category.service";
import { DeleteForAdminLogic } from "./delete";

export class OptionService {
  createOptionLogic: CreateOptionLogic;
  listByCategoryIdLogic: ListByCategoryIdLogic;
  updateLogic: UpdateLogic;
  getForAdminLogic: GetForAdminLogic;
  deleteLogic: DeleteForAdminLogic

  constructor(private categoryService: CategoryService) {
    this.createOptionLogic = new CreateOptionLogic(this.categoryService);
    this.listByCategoryIdLogic = new ListByCategoryIdLogic();
    this.updateLogic = new UpdateLogic(this.categoryService);
    this.getForAdminLogic = new GetForAdminLogic();
    this.deleteLogic = new DeleteForAdminLogic();
  }

  createOption(data: any, language: string) {
    return this.createOptionLogic.create(data, language);
  }

  listByCategoryId(
    categoryId: any,
    language: string,
    forAdmin: boolean = false
  ) {
    return this.listByCategoryIdLogic.list({ categoryId }, language, forAdmin);
  }

  updateOption(optionId: string, data: any, language: string) {
    return this.updateLogic.update(optionId, data, language);
  }

  getForAdmin(id: any, language: string) {
    return this.getForAdminLogic.list({ id }, language);
  }

  deleteOption(id: any) {
    return this.deleteLogic.delete({id});
  }
}
