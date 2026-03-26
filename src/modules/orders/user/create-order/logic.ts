import { BadRequestError } from "../../../../shared/utils/custom-errors";
import { inputSchema, Input } from "./input";

export class CreateOrderLogic {
  async create(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    throw new BadRequestError("online_payment_not_configured");
  }
}
