import User from "../user.model";
import { Input, inputSchema } from "./input";
import { markFilesAsUsed, deleteImages } from "../../../shared/utils/files";
import { NotFoundError } from "../../../shared/utils/custom-errors";

export class UpdateUserDataLogic {
  constructor() {}

  async execute(input: Input) {
    const { data, user } = inputSchema.parse(input);

    if (!data.address) delete data.address;

    const userObj = await User.findByIdAndUpdate(user, {
      ...data,
      photo: data.photo[0]._id,
    });

    if (!userObj) {
      throw new NotFoundError("user_not_found");
    }

    if (userObj.photo) {
      await deleteImages([userObj.photo]);
    }

    await markFilesAsUsed(data.photo.map((photo) => photo._id));

    return null;
  }
}
