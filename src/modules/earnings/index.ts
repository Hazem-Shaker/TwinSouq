import { EarningRouter } from "./earning.router";
import { EarningService } from "./earning.service";
import {
  JOB_NAME as UPDATE_EARNING_STATUS_JOB_NAME,
  UpdateEarningStatusJob,
} from "./jobs/updateEarningStatusJob";
import agenda from "../../shared/scheduler/agenda";
import { Job } from "agenda";
import mongoose from "mongoose";

export class EarningModule {
  private earningRouter: EarningRouter;
  private updateEarningStatusJob: UpdateEarningStatusJob;
  earningService: EarningService;

  constructor() {
    this.earningService = new EarningService();
    this.earningRouter = new EarningRouter(this.earningService);
    this.updateEarningStatusJob = new UpdateEarningStatusJob();

    this.registerJobs();
  }

  routerFactory() {
    return this.earningRouter.createRouter();
  }

  private async registerJobs() {
    agenda.define(UPDATE_EARNING_STATUS_JOB_NAME, async (job: Job) => {
      const { earningId } = job.attrs.data as { earningId: string };
      if (!earningId) {
        console.error("Earning ID is missing.");
        return;
      }
      try {
        await this.updateEarningStatusJob.execute(
          new mongoose.Types.ObjectId(earningId)
        );
        console.log(`✅ Earning status updated for earning ${earningId}`);
      } catch (error) {
        console.error(
          `❌ Failed to update earning status for earning ${earningId}:`,
          error
        );
      }
    });
  }
}
