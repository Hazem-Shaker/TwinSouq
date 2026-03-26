import { Request, Response, NextFunction } from "express";
import { AddressService } from "./address.service";

export class AddressController {
  constructor(public addressService: AddressService) {}

  async createForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.createAddress(
        user.id,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("address.created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async createForProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.createAddress(
        user.providerId,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("address.created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.updateAddress(
        req.params.id,
        user.id,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("address.updated"), response);
    } catch (error) {
      next(error);
    }
  }

  async updateForProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.updateAddress(
        req.params.id,
        user.providerId,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("address.updated"), response);
    } catch (error) {
      next(error);
    }
  }

  async listForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.listAddresses(
        user.id,
        req.language
      );
      res.sendSuccess(req.t("address.listed"), response);
    } catch (error) {
      next(error);
    }
  }

  async listForProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.listAddresses(
        user.providerId,
        req.language
      );
      res.sendSuccess(req.t("address.listed"), response);
    } catch (error) {
      next(error);
    }
  }

  async getForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.getAddress(
        req.params.id,
        user.id,
        req.language
      );
      res.sendSuccess(req.t("address.found"), response);
    } catch (error) {
      next(error);
    }
  }

  async getForProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const response = await this.addressService.getAddress(
        req.params.id,
        user.providerId,
        req.language
      );
      res.sendSuccess(req.t("address.found"), response);
    } catch (error) {
      next(error);
    }
  }

  async deleteForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      await this.addressService.deleteAddress(
        req.params.id,
        user.id,
        req.language
      );
      res.sendSuccess(req.t("address.deleted"));
    } catch (error) {
      next(error);
    }
  }

  async deleteForProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      await this.addressService.deleteAddress(
        req.params.id,
        user.providerId,
        req.language
      );
      res.sendSuccess(req.t("address.deleted"));
    } catch (error) {
      next(error);
    }
  }
}
