"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    installmentsOrderId: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("order_id_missing"),
});
