import { validateToken } from "../../utils/auth/tokenUtils";
import { Request, Response, NextFunction } from "express";
import User from "../../../modules/users/user.model";
import Provider from "../../../modules/providers/provider.model";
import { IUserResponseData } from "../../../modules/users/types";
import {
  UnauthorizedError,
  IncompleteUserData,
} from "../../utils/custom-errors";

export class CheckUser {
  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req?.headers?.authorization?.split(" ")[1];

      if (token) {
        const decoded = await validateToken(token);
        if (decoded) {
          const user = decoded as { id: string };
          const userData = (await User.findById(user.id)) as IUserResponseData;
          if (userData) {
            req.user = {
              id: user.id,
              email: userData.email,
              name: userData.name,
              type: "user",
            };
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
