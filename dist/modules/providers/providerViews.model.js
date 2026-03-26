"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const providerViewsSchema = new mongoose_1.Schema({
    provider: { type: mongoose_1.Schema.Types.ObjectId, ref: "Provider" },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
});
providerViewsSchema.index({ provider: 1, user: 1 }, { unique: true });
const ProviderViews = (0, mongoose_1.model)("ProviderViews", providerViewsSchema);
exports.default = ProviderViews;
