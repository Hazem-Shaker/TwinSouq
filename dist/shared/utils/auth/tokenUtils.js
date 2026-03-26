"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.validateToken = validateToken;
exports.deleteToken = deleteToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const Token_1 = __importDefault(require("../../models/Token"));
async function generateToken(id, status = "active", expiresIn = "never") {
    const payload = {
        id: id,
        iat: Date.now(),
    };
    const options = {};
    if (expiresIn !== "never") {
        options.expiresIn = expiresIn;
    }
    const signedToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, options);
    await Token_1.default.create({
        user: id,
        token: "Bearer " + signedToken,
        status,
    });
    return "Bearer " + signedToken;
}
async function validateToken(token) {
    const tokenDoc = await Token_1.default.findOne({ token: "Bearer " + token });
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
async function deleteToken(token) {
    await Token_1.default.deleteOne({ token: "Bearer " + token });
    return true;
}
