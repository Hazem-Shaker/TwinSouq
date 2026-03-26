import Address from "../adress.model";
import { inputSchema, Input } from "./input";
import { ConflictError } from "../../../shared/utils/custom-errors";

export class UpdateLogic {
  constructor() {}

  async update(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const existingTitle = await Address.findOne({
      id: { $ne: input.id },
      owner: input.data.owner,
      title: input.data.title,
    });

    if (
      existingTitle &&
      existingTitle.owner.toString() !== input.data.owner.toString()
    ) {
      throw new ConflictError("title_of_the_address_exits");
    }

    const address = await Address.findByIdAndUpdate(
      input.id,
      { ...input },
      { new: true }
    );

    return address;
  }
}
