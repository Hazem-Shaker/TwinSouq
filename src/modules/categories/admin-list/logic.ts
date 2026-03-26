import { inputSchema, Input } from './input';
import Category from '../category.model';
import { config } from "../../../shared/config";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import { ICategoryResponseData } from "../types";

export class ListLogicForAdmin {
  async listForAdmin (requestQuery: Input, filter: string): Promise<ICategoryResponseData[]> {
    let filterParam = filter?.trim() || 'all';

    if (filterParam !== 'active' && filterParam !== 'inActive' && filterParam !== 'all') {
      throw new NotFoundError("Invalid filter");
    }
    
    let matchStage;
    if (filterParam === 'active') {
      matchStage = { isActive: true };
    } else if (filterParam === 'inActive') {
      matchStage = { isActive: false };
    } else {
      matchStage = {};
    }

    const categories = await Category.aggregate([
      { $match: matchStage },
      { $skip: Number(requestQuery.skip)},
      { $limit: Number(requestQuery.limit)},
      {
        $lookup: {
          from: "files",
          localField: "image",
          foreignField: "_id",
          as: "image",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "parent",
          foreignField: "_id",
          as: "parent",
        },
      },
      {
        $unwind: {
          path: "$image",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$parent",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "parent.image",
          foreignField: "_id",
          as: "parent.image",
        },
      },
      {
        $unwind: {
          path: "$parent.image",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          slug: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          "image._id": 1,
          "image.path": 1,
          parent: {
            _id: 1,
            name: 1,
            description: 1,
            'image._id': 1,
            'image.path': 1,
            slug: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      },
    ]);
    if (!categories) {
      throw new NotFoundError("Category not found");
    }
    return categories;
  }
}
