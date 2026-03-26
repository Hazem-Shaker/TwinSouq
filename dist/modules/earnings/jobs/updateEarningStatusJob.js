"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEarningStatusJob = exports.JOB_NAME = void 0;
const earning_model_1 = __importDefault(require("../earning.model"));
const providerBalance_model_1 = __importDefault(require("../providerBalance.model"));
exports.JOB_NAME = "UPDATE_EARNING_STATUS";
class UpdateEarningStatusJob {
    constructor() { }
    async execute(id) {
        const earning = await earning_model_1.default.findByIdAndUpdate(id, {
            status: "available",
        });
        if (!earning) {
            return null;
        }
        await providerBalance_model_1.default.findOneAndUpdate({ provider: earning.provider }, {
            $inc: {
                availableBalance: earning.amount,
                pendingBalance: -earning.amount,
            },
        }, { new: true });
        return null;
    }
}
exports.UpdateEarningStatusJob = UpdateEarningStatusJob;
