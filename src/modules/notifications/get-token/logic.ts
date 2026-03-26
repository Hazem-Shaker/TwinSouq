import { GetTokenInput, getTokenInputSchema } from "./input";
import { getTokenForUser } from "../utils";

export class GetTokenLogic {
  constructor() {}

  async getToken(input: GetTokenInput) {
    const { userId, type } = getTokenInputSchema.parse(input);
    const id = `${type}-${userId.toString()}`;
    const { token } = await getTokenForUser(id);

    return {
      token,
    };
  }
}
