"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const mark_file_as_used_1 = require("./mark-file-as-used");
const mark_files_as_unused_1 = require("./mark-files-as-unused");
class FileService {
    constructor() {
        this.markFileAsUsedLogic = new mark_file_as_used_1.MarkFileAsUsedLogic();
        this.markFilesAsUnusedLogic = new mark_files_as_unused_1.MarkFileAsUnusedLogic();
    }
    async markFileAsUsed(fileIds, userId, session) {
        console.log("markFileAsUsed", fileIds, userId);
        return this.markFileAsUsedLogic.markFileAsUsed({ fileIds, userId }, session);
    }
    async markFilesAsUnused(fileIds, userId, session) {
        return this.markFilesAsUnusedLogic.markFilesAsUnused({ fileIds, userId }, session);
    }
}
exports.FileService = FileService;
