"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringSchema = void 0;
const zod_1 = require("zod");
const stringSchema = (fieldName, required = true, additionalVallidation = undefined) => {
    if (required) {
        return zod_1.z
            .any()
            .refine((value) => value, {
            message: `${fieldName}_missing`,
        })
            .refine((value) => typeof value === "string", {
            message: `${fieldName}_wrong_type`,
        })
            .refine(additionalVallidation ? additionalVallidation : (value) => true, {
            message: `${fieldName}_wrong_format`,
        });
    }
    return zod_1.z
        .any()
        .refine((value) => {
        if (!value)
            return true;
        return typeof value === "string";
    }, {
        message: `${fieldName}_wrong_type`,
    })
        .refine(additionalVallidation ? additionalVallidation : (value) => true, {
        message: `${fieldName}_wrong_format`,
    });
};
exports.stringSchema = stringSchema;
