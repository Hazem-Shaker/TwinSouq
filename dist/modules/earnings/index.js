"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningModule = void 0;
const earning_router_1 = require("./earning.router");
const earning_service_1 = require("./earning.service");
const updateEarningStatusJob_1 = require("./jobs/updateEarningStatusJob");
const agenda_1 = __importDefault(require("../../shared/scheduler/agenda"));
const mongoose_1 = __importDefault(require("mongoose"));
class EarningModule {
    constructor() {
        this.earningService = new earning_service_1.EarningService();
        this.earningRouter = new earning_router_1.EarningRouter(this.earningService);
        this.updateEarningStatusJob = new updateEarningStatusJob_1.UpdateEarningStatusJob();
        this.registerJobs();
    }
    routerFactory() {
        return this.earningRouter.createRouter();
    }
    async registerJobs() {
        agenda_1.default.define(updateEarningStatusJob_1.JOB_NAME, async (job) => {
            const { earningId } = job.attrs.data;
            if (!earningId) {
                console.error("Earning ID is missing.");
                return;
            }
            try {
                await this.updateEarningStatusJob.execute(new mongoose_1.default.Types.ObjectId(earningId));
                console.log(`✅ Earning status updated for earning ${earningId}`);
            }
            catch (error) {
                console.error(`❌ Failed to update earning status for earning ${earningId}:`, error);
            }
        });
    }
}
exports.EarningModule = EarningModule;
