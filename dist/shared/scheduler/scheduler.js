"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = exports.cancelJobs = exports.scheduleRecurringJob = exports.scheduleJob = void 0;
const agenda_1 = __importDefault(require("./agenda"));
const scheduleJob = async (jobName, when, data) => {
    console.log(jobName, when, data);
    await agenda_1.default.schedule(when, jobName, data);
};
exports.scheduleJob = scheduleJob;
const scheduleRecurringJob = async (jobName, interval, data) => {
    await agenda_1.default.every(interval, jobName, data);
};
exports.scheduleRecurringJob = scheduleRecurringJob;
const cancelJobs = async (jobName) => {
    await agenda_1.default.cancel({ name: jobName });
};
exports.cancelJobs = cancelJobs;
const now = async (jobName, data) => {
    await agenda_1.default.now(jobName, data);
};
exports.now = now;
