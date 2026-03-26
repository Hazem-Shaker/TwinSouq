"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTempToken = generateTempToken;
exports.validateTempToken = validateTempToken;
exports.deleteTempToken = deleteTempToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const TempToken_1 = __importDefault(require("../../models/TempToken"));
async function generateTempToken(id, email, expiresIn = "15m") {
    const payload = {
        id: id,
    };
    const options = {
        expiresIn,
    };
    const signedToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, options);
    await TempToken_1.default.create({
        email,
        token: signedToken,
    });
    return signedToken;
}
async function validateTempToken(token) {
    const tokenDoc = await TempToken_1.default.findOne({ token });
    if (!tokenDoc) {
        return null;
    }
    let data = { id: "" };
    jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret, (error, user) => {
        if (error) {
            data = null;
            return;
        }
        data = user;
    });
    return data;
}
async function deleteTempToken(token) {
    await TempToken_1.default.deleteOne({ token });
    return true;
}
