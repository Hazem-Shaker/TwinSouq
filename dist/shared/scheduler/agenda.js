"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agenda_1 = __importDefault(require("agenda"));
const config_1 = require("../config");
const agenda = new agenda_1.default({
    db: {
        address: config_1.config.database.uri,
        collection: "agendaJobs",
    },
    processEvery: "60 seconds",
    defaultLockLifetime: 10000,
});
agenda.on("error", (err) => {
    console.error("❌ Agenda connection error:", err);
});
exports.default = agenda;
