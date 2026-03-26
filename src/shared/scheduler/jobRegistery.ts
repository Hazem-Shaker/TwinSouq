import agenda from "./agenda";
import { scheduleRecurringJob } from "./scheduler";
import registerCleanUpJob, {
  JOB_NAME as CLEANUP_JOB,
} from "./jobs/cleanFilesJob";

export const initScheduler = async () => {
  registerCleanUpJob(agenda);

  await agenda.start();
  console.log("🚀 Agenda started");
  const existingJobs = await agenda.jobs({ name: CLEANUP_JOB });
  if (existingJobs.length === 0) {
    await scheduleRecurringJob(CLEANUP_JOB, "0 0 * * *");
    console.log("🗓️ Scheduled daily cleanup job at midnight");
  }
};
