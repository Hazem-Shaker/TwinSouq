"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRouter = void 0;
const express_1 = require("express");
const file_controller_1 = require("./file.controller");
const upload_1 = require("../../shared/middlewares/upload");
const auth_1 = require("../../shared/middlewares/auth");
class FileRouter {
    constructor(fileService) {
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
        this.fileService = fileService;
        this.fileController = new file_controller_1.FileController(this.fileService);
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.post("/test-cloudinary", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), upload_1.upload.fields([
            { name: "mainImage", maxCount: 1 },
            { name: "images", maxCount: 6 },
        ]), (0, upload_1.processImagesMiddleware)(["mainImage", "images"]), async (req, res, next) => {
            res.send(req.body);
        });
        router.delete("/delete-image/:fileId", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.fileController.deleteFile.bind(this.fileController));
        return router;
    }
}
exports.FileRouter = FileRouter;
