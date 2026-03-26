import { validateToken } from "../../utils/auth/tokenUtils";
import { Request, Response, NextFunction } from "express";
import User from "../../../modules/users/user.model";
import { IUserResponseData } from "../../../modules/users/types";
import { UnauthorizedError } from "../../utils/custom-errors";

export class UserAuthMiddleware {
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

      req.user = {
        id: user.id,
        email: userData.email,
        name: userData.name,
        type: "user",
      };
      next();
    } catch (error) {
      next(error);
    }
  }

  async authenticateWithProviderRole(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
        throw new UnauthorizedError("you_don't_have_provider_role");
      }

      req.user = {
        id: user.id,
        email: userData.email,
        name: userData.name,
        type: "user",
      };
      next();
    } catch (error) {
      next(error);
    }
  }
}
