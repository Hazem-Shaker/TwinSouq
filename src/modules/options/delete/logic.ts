import { Option } from "../option.model";
import { Input, inputSchema } from "./input";
import { optionsAggregation } from "../../../shared/utils/aggregations";
import { NotFoundError } from "../../../shared/utils/custom-errors";
export class DeleteForAdminLogic {
  async delete(input: Input, language: string = "en") {
    // Validate and parse the input
    input = inputSchema.parse(input);
    console.log("Deleting option with input:", input);
    const { id } = inputSchema.parse(input);
    const optionExists = await Option.findByIdAndDelete(id);
    if (!optionExists) {
      throw new NotFoundError("option_not_found");
    }
    return true;
  }
}
