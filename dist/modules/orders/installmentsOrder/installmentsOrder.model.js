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
const installmentsOrderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    provider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    variant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ["sent", "approved", "rejected"],
        default: "sent",
    },
    paymentStatus: {
        type: String,
        enum: ["first-payment", "late-payment", "next-payment", "done"],
        default: "first-payment",
    },
    shippingStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },
    name_ar: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        requried: true,
    },
    price: {
        type: Number,
        required: true,
    },
    numberOfMonths: {
        type: Number,
        required: true,
    },
    accountStatement: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "File",
    },
    initialPayment: {
        type: Number,
        required: true,
    },
    eachPayment: {
        type: Number,
        required: true,
    },
    salaryCertificate: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "File",
    },
    contract: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "File",
    },
    iban: {
        type: String,
        required: true,
    },
    donePayments: {
        type: Number,
        default: 0,
    },
    paidInstallments: {
        type: [
            {
                order: Number,
                amount: Number,
                date: Date,
                status: {
                    type: String,
                    enum: ["pending", "paid"],
                    default: "pending",
                },
                transactionId: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                },
            },
        ],
        default: [],
    },
    address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Address",
    },
    profitPercent: {
        type: Number,
        required: true,
    },
    nextPayment: {
        type: {
            amount: Number,
            date: Date,
        },
        default: null,
    },
    transactionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
    },
    dueDate: {
        type: Date,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
installmentsOrderSchema.index({ user: 1 });
installmentsOrderSchema.index({ provider: 1, status: 1, paymentStatus: 1 });
const InstallmentsOrder = mongoose_1.default.model("InstallmentsOrder", installmentsOrderSchema);
exports.default = InstallmentsOrder;
