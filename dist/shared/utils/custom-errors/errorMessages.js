"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.errorMessages = void 0;
exports.errorMessages = {
    en: {
        userNotFound: "User doesn't exist.",
        otpNotGenerated: "OTP not generated",
        otpExpired: "OTP expired",
        invalidOtp: "Invalid OTP",
        invalidToken: "Invalid token",
    },
    ar: {
        userNotFound: "المستخدم غير موجود",
        otpNotGenerated: "لا يوجد رمز تحقق مطابق",
        otpExpired: "انتهت صلاحية رمز التحقق",
        invalidOtp: "خطاء في رمز التحقق",
        invalidToken: "الرمز غير صالح",
    },
};
/**
 * Helper function to get error messages based on language and error key.
 * @param language - The language code (e.g., "en", "ar").
 * @param key - The error key (e.g., "userNotFound").
 * @returns The error message in the specified language, or English as fallback.
 */
const getErrorMessage = (language, key) => {
    const messages = exports.errorMessages[language] || exports.errorMessages.en;
    return messages[key];
};
exports.getErrorMessage = getErrorMessage;
