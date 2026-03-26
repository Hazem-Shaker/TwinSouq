import { validateToken } from "../../utils/auth/tokenUtils";
import { Request, Response, NextFunction } from "express";
import User from "../../../modules/users/user.model";
import Provider from "../../../modules/providers/provider.model";
import { IUserResponseData } from "../../../modules/users/types";
import {
  UnauthorizedError,
  IncompleteUserData,
} from "../../utils/custom-errors";

export class ProviderAuthMiddleware {
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req?.headers?.authorization?.split(" ")[1];
      if (!token) {
        throw new UnauthorizedError("No token provided");
      }

      const decoded = await validateToken(token);
      if (!decoded) {
        throw new UnauthorizedError("Invalid token");
      }
      const user = decoded as { id: string };
      const userData = (await User.findById(user.id)) as IUserResponseData;
      if (!userData) {
        throw new UnauthorizedError("User not found");
      }

      if (!userData.roles.includes("provider")) {
        throw new UnauthorizedError("User is not a provider");
      }

      // search for the provider profile
      const provider = await Provider.findOne({ user: user.id });

      if (!provider) {
        throw new IncompleteUserData("complete_your_profile");
      }

      // add provider id to the user.request object
      req.user = {
        id: user.id,
        providerId: provider?._id?.toString() ? provider._id.toString() : "",
        email: userData.email,
        name: userData.name,
        type: "provider",
      };

      next();
    } catch (error) {
      next(error);
    }
  }
}
