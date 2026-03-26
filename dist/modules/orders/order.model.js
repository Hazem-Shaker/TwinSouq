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
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    provider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    transaction: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    products: {
        type: [
            {
                id: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                },
                variant: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                },
                provider: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                },
                name_ar: {
                    type: String,
                },
                name_en: {
                    type: String,
                },
                description_ar: {
                    type: String,
                },
                description_en: {
                    type: String,
                },
                price: {
                    type: Number,
                },
                salePrice: {
                    type: Number,
                },
                salePercent: {
                    type: Number,
                },
                image: {
                    url: {
                        type: String,
                    },
                },
                quantity: {
                    type: Number,
                },
                profitPercent: {
                    type: Number,
                },
                options: {
                    type: [
                        {
                            name_ar: {
                                type: String,
                            },
                            name_en: {
                                type: String,
                            },
                            value_ar: {
                                type: String,
                            },
                            value_en: {
                                type: String,
                            },
                        },
                    ],
                },
            },
        ],
        default: [],
    },
    price: {
        type: Number,
    },
    shippingPrice: {
        type: Number,
    },
    shippingStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },
    address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
}, { timestamps: true });
orderSchema.index({ user: 1 });
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ provider: 1 });
orderSchema.index({ provider: 1, status: 1 });
orderSchema.index({ user: 1, provider: 1 });
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
