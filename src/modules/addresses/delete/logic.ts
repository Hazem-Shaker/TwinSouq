import Address from "../adress.model";
import { inputSchema, Input } from "./input";
import { NotFoundError } from "../../../shared/utils/custom-errors";

export class DeleteLogic {
  constructor() {}

  async remove(input: Input, language: string = "en") {
    const { id, owner } = inputSchema.parse(input);

    const address = Address.findOne({
      _id: id,
      owner,
    });

    if (!address) {
      throw new NotFoundError("address_not_found");
    }

    await Address.findByIdAndDelete(id);

    return null;
  }
}
