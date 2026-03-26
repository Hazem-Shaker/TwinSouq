"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderRequestInputSchema = exports.rejectProviderRequestInputSchema = exports.acceptProviderRequestInputSchema = exports.paginationSchema = exports.querySchema = exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema.refine((value) => value, {
        message: "provider_id_missing",
    }),
    iban: zod_1.z
        .any()
        .refine((val) => val, {
        message: "iban_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "iban_wrong_type",
    }),
    address: zod_1.z
        .any()
        .refine((val) => val, {
        message: "address_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "address_wrong_type",
    }),
    idNumber: custom_checckers_1.identityNumberSchema,
    birthdate: custom_checckers_1.legalAgeScema,
    gender: zod_1.z
        .any()
        .refine((val) => val, {
        message: "gender_missing",
    })
        .refine((val) => typeof val === "string" && ["male", "female"].includes(val), {
        message: "gender_wrong_value",
    }),
    photo: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "photo_missing" }), // Restrict array length to 1,
    idImageFront: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "id_front_missing" }), // Restrict array length to 1
    idImageBack: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "id_back_missing" }), // Restrict array length to 1
});
exports.querySchema = zod_1.z.object({
    filter: zod_1.z.optional(zod_1.z.string()),
});
exports.paginationSchema = zod_1.z.object({
    skip: zod_1.z.number().int().gte(0),
    limit: zod_1.z.number().int().positive(),
});
exports.acceptProviderRequestInputSchema = zod_1.z.object({
    providerRequestId: custom_checckers_1.mongoIdSchema,
});
exports.rejectProviderRequestInputSchema = zod_1.z.object({
    providerRequestId: custom_checckers_1.mongoIdSchema,
});
exports.getProviderRequestInputSchema = zod_1.z.object({
    providerRequestId: custom_checckers_1.mongoIdSchema,
});
