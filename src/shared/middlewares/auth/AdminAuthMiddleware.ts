import { validateToken } from "../../utils/auth/tokenUtils";
import { Request, Response, NextFunction } from "express";
import Admin from "../../../modules/admins/admin.model";
import { IAdmin } from "../../../modules/admins/types";
import { UnauthorizedError } from "../../utils/custom-errors";

export class AdminAuthMiddleware {
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
      const userData = (await Admin.findById(user.id)) as IAdmin;
      if (!userData) {
        throw new UnauthorizedError("Admin not found");
      }

      req.user = {
        id: user.id,
        email: userData.email,
        name: userData.name,
        type: "admin",
      };
      next();
    } catch (error) {
      next(error);
    }
  }
}
