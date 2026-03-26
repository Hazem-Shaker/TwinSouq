"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModule = void 0;
const file_service_1 = require("./file.service");
const file_router_1 = require("./file.router");
class FileModule {
    constructor() {
        this.fileService = new file_service_1.FileService();
        this.fileRouter = new file_router_1.FileRouter(this.fileService);
    }
    routerFactory() {
        return this.fileRouter.createRouter();
    }
}
exports.FileModule = FileModule;
