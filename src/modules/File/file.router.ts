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


    /**
     * @openapi
     * /api/File/test-cloudinary:
     *   post:
     *     tags: [File]
     *     summary: POST /test-cloudinary
     *     responses:
     *       200:
     *         description: Success
     */
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


    /**
     * @openapi
     * /api/File/delete-image/:fileId:
     *   delete:
     *     tags: [File]
     *     summary: DELETE /delete-image/:fileId
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      "/delete-image/:fileId",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.fileController.deleteFile.bind(this.fileController)
    );

    return router;
  }
}
