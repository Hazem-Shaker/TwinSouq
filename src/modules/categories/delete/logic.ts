import { inputSchema, Input } from './input';
import Category from '../category.model';
import { config } from "../../../shared/config";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import { ICategoryResponseData } from "../types";

export class DeleteLogic {
  async delete (slug: string): Promise<ICategoryResponseData[]> {
    const categories = await Category.findOneAndDelete({
      $or: [
        { slug_ar: slug },
        { slug_en: slug }
      ]
    });
    if (!categories) {
      throw new NotFoundError("Category not found.");
    }
    return [categories];
  }
}