import { inputSchema, Input } from "./input";
import Address from "../adress.model";
import { NotFoundError } from "../../../shared/utils/custom-errors";

export class GetLogic {
  constructor() {}

  async get(input: Input, language: string = "en") {
    const { owner, id } = inputSchema.parse(input);
    const address = await Address.findOne({ _id: id, owner });

    if (!address) {
      throw new NotFoundError("address_not_found");
    }

    return address;
  }
}
