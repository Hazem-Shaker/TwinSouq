"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityNumberSchema = void 0;
const zod_1 = require("zod");
function luhnCheck(id) {
    let sum = 0;
    let shouldDouble = false;
    // Loop through the digits starting from the right
    for (let i = id.length - 1; i >= 0; i--) {
        let digit = parseInt(id[i]);
        // Double every second digit
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9; // If the result is greater than 9, subtract 9
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble; // Alternate between doubling and not doubling
    }
    // Check if the sum is divisible by 10
    return sum % 10 === 0;
}
// Zod schema to validate the ID number
exports.identityNumberSchema = zod_1.z
    .any()
    .refine((value) => value, {
    message: "id_number_missing",
})
    .refine((val) => {
    if (typeof val !== "string")
        return false;
    const regex = /^\d{10}$/;
    return regex.test(val);
}, {
    message: "invalid_id_number",
});
