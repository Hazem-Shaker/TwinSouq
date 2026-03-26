"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_NAME = void 0;
const file_model_1 = __importDefault(require("../../../modules/File/file.model"));
const files_1 = require("../../utils/files");
exports.JOB_NAME = "clean_files";
exports.default = (agenda) => {
    agenda.define(exports.JOB_NAME, async () => {
        console.log("🧹 Starting daily cleanup...");
        const files = await file_model_1.default.find({
            used: false,
        }).limit(500);
        await (0, files_1.deleteFiles)(files.map((f) => f._id));
    });
};
