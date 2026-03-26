import { inputSchema, Input } from "./input";
import Address from "../adress.model";

export class ListLogic {
  constructor() {}

  async list(input: Input, language: string = "en") {
    const { owner } = inputSchema.parse(input);
    const addresses = await Address.find({ owner });

    return addresses;
  }
}
