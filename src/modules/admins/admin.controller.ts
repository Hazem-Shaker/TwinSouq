import { AdminService } from "./admin.service";
import { Request, Response, NextFunction } from "express";

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminService.createAdmin(req.body);
      res.sendSuccess("Admin created successfully", response, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminService.login(req.body);
      res.sendSuccess("Admin logged in successfully", response, 200);
    } catch (error) {
      next(error);
    }
  }
}