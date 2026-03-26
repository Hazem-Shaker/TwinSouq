"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
// option.input.ts
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    id: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("option_id_missing"),
});
