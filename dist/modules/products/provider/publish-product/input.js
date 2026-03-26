"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    provider: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("provider_id_wrong_value"),
    id: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("product_id_wrong_value"),
});
