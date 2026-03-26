import Address from "../adress.model";
import { inputSchema, Input } from "./input";
import {
  ConflictError,
  ForbiddenError,
} from "../../../shared/utils/custom-errors";

export class CreateLogic {
  constructor() {}

  async create(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const existingTitle = await Address.findOne({
      owner: input.owner,
      title: input.title,
    });

    if (existingTitle) {
      throw new ConflictError("title_of_the_address_exits");
    }

    const numberOfAddresses = await Address.countDocuments({
      owner: input.owner,
    });

    if (numberOfAddresses >= 10) {
      throw new ConflictError("addresses_limit");
    }

    const address = await Address.create({ ...input });
    return address;
  }
}
