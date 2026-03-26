"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markFilesAsUsed = void 0;
const file_model_1 = __importDefault(require("../../../modules/File/file.model"));
const markFilesAsUsed = async (filesId) => {
    if (filesId.length === 0)
        return true;
    await file_model_1.default.updateMany({ _id: { $in: filesId } }, { used: true });
    return true;
};
exports.markFilesAsUsed = markFilesAsUsed;
