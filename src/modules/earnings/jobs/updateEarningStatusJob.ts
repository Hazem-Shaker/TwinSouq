import Earning from "../earning.model";
import ProviderBalance from "../providerBalance.model";
import mongoose from "mongoose";

export const JOB_NAME = "UPDATE_EARNING_STATUS";

export class UpdateEarningStatusJob {
  constructor() {}

  async execute(id: mongoose.Types.ObjectId) {
    const earning = await Earning.findByIdAndUpdate(id, {
      status: "available",
    });
    if (!earning) {
      return null;
    }

    await ProviderBalance.findOneAndUpdate(
      { provider: earning.provider },
      {
        $inc: {
          availableBalance: earning.amount,
          pendingBalance: -earning.amount,
        },
      },
      { new: true }
    );

    return null;
  }
}
