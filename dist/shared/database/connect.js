"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const config_1 = require("../config");
async function connectDatabase() {
    try {
        const options = {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        await mongoose_1.default.connect(config_1.config.database.uri, options);
        logger_1.default.info("Successfully connected to MongoDB");
        mongoose_1.default.connection.on("error", (error) => {
            logger_1.default.error("MongoDB connection error:", error);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            logger_1.default.warn("MongoDB disconnected. Attempting to reconnect...");
        });
        process.on("SIGINT", async () => {
            try {
                await mongoose_1.default.connection.close();
                logger_1.default.info("MongoDB connection closed through app termination");
                process.exit(0);
            }
            catch (error) {
                logger_1.default.error("Error while closing MongoDB connection:", error);
                process.exit(1);
            }
        });
    }
    catch (error) {
        logger_1.default.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
