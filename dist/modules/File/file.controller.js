"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const custom_errors_1 = require("../../shared/utils/custom-errors");
class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async uploadImage(req, res, next) {
        try {
            const file = req.file;
            const user = req.user.id;
            if (!file) {
                throw new custom_errors_1.InvalidCredentialsError("File not found");
            }
            // const uploadedFile = await this.fileService.uploadImage(file, user);
            res.sendSuccess("File uploaded successfully", null, 201);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async deleteFile(req, res, next) {
        try {
            const fileId = req.params.fileId;
            const user = req.user.id;
            // await this.fileService.deleteFile(fileId, user);
            res.sendSuccess("File deleted successfully", null, 204);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.FileController = FileController;
