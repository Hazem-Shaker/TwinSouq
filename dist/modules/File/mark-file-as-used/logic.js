"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkFileAsUsedLogic = void 0;
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const file_model_1 = __importDefault(require("../file.model"));
const input_1 = require("./input");
class MarkFileAsUsedLogic {
    async markFileAsUsed(data, session) {
        const { fileIds, userId } = input_1.inputSchema.parse(data);
        const files = await file_model_1.default.find({
            _id: { $in: fileIds },
        });
        if (!files || files.length === 0) {
            throw new custom_errors_1.NotFoundError("File not found");
        }
        for (let file of files) {
            if (file.owner.toString() === userId.toString()) {
                file.used = true;
                console.log(file);
                await file.save({ session });
            }
        }
        return "Files marked as used";
    }
}
exports.MarkFileAsUsedLogic = MarkFileAsUsedLogic;
