"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    provider: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Provider",
        required: true,
    },
    name_ar: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        required: true,
    },
    description_ar: {
        type: String,
        required: true,
    },
    description_en: {
        type: String,
        required: true,
    },
    archive: { type: Boolean, default: false },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    category: { type: mongoose_1.default.Types.ObjectId, ref: "Category" },
    images: [{ type: mongoose_1.default.Types.ObjectId, ref: "File" }],
    notificationDays: {
        type: Number,
        required: true,
    },
    notificationHours: {
        type: Number,
        required: true,
    },
    paymentChoices: {
        type: String,
        enum: ["cash", "installements", "both"],
        required: true,
    },
    // options: {
    //   type: [
    //     {
    //       key: {
    //         type: String,
    //       },
    //       values: {
    //         type: [String],
    //       },
    //     },
    //   ],
    // },
    installmentOptions: {
        type: [
            {
                period: {
                    type: Number,
                    required: true,
                },
                profitPercantage: {
                    type: Number,
                    required: true,
                },
                upfrontPercentage: {
                    type: Number,
                    required: true,
                },
                contract: {
                    type: mongoose_1.default.Types.ObjectId,
                    ref: "File",
                    required: true,
                },
            },
        ],
        default: [],
    },
    visible: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
}, { timestamps: true });
productSchema.index({ price: 1 });
productSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        return ret;
    },
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
