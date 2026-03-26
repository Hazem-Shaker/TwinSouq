import { Router } from "express";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import {
  processImagesMiddleware,
  upload,
} from "../../shared/middlewares/upload";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";

export class FileRouter {
  private fileService: FileService;
  private fileController: FileController;
  userAuthMiddleware: UserAuthMiddleware;
  constructor(fileService: FileService) {
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.fileService = fileService;
    this.fileController = new FileController(this.fileService);
  }

  createRouter() {
    const router = Router();

    router.post(
      "/test-cloudinary",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "images", maxCount: 6 },
      ]),
      processImagesMiddleware(["mainImage", "images"]),
      async (req, res, next) => {
        res.send(req.body);
      }
    );

    router.delete(
      "/delete-image/:fileId",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.fileController.deleteFile.bind(this.fileController)
    );

    return router;
  }
}
