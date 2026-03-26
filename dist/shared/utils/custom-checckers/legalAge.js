"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalAgeScema = void 0;
const zod_1 = require("zod");
const date_1 = require("../date");
// Custom validation to check if the person is older than 18 years
const ageValidator = (dobDate) => {
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    // Check if the person is at least 18 years old
    if (currentDate.getMonth() < dobDate.getMonth() ||
        (currentDate.getMonth() === dobDate.getMonth() &&
            currentDate.getDate() < dobDate.getDate())) {
        return age - 1; // Subtract 1 year if birthday hasn't occurred yet this year
    }
    return age;
};
// Zod schema to validate a date of birth
exports.legalAgeScema = zod_1.z
    .any()
    .refine((value) => value, {
    message: "age_date_missing",
})
    .refine((val) => {
    const date = (0, date_1.parseValidDMY)(val);
    console.log(date);
    if (!date) {
        return false;
    }
    return true;
}, {
    message: "invalid_age_date",
})
    .refine((value) => ageValidator((0, date_1.parseValidDMY)(value) ?? new Date()) >= 18, {
    message: "underage",
})
    .transform((val) => (0, date_1.parseValidDMY)(val));
