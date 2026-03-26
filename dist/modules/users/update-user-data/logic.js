"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDataLogic = void 0;
const user_model_1 = __importDefault(require("../user.model"));
const input_1 = require("./input");
const files_1 = require("../../../shared/utils/files");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class UpdateUserDataLogic {
    constructor() { }
    async execute(input) {
        const { data, user } = input_1.inputSchema.parse(input);
        if (!data.address)
            delete data.address;
        const userObj = await user_model_1.default.findByIdAndUpdate(user, {
            ...data,
            photo: data.photo[0]._id,
        });
        if (!userObj) {
            throw new custom_errors_1.NotFoundError("user_not_found");
        }
        if (userObj.photo) {
            await (0, files_1.deleteImages)([userObj.photo]);
        }
        await (0, files_1.markFilesAsUsed)(data.photo.map((photo) => photo._id));
        return null;
    }
}
exports.UpdateUserDataLogic = UpdateUserDataLogic;
