"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderLogic = void 0;
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const input_1 = require("./input");
class CreateOrderLogic {
    async create(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        throw new custom_errors_1.BadRequestError("online_payment_not_configured");
    }
}
exports.CreateOrderLogic = CreateOrderLogic;
