import mongoose, { Schema, Model } from "mongoose";
import { IInstallmentsOrder } from "./types";

const installmentsOrderSchema: Schema<IInstallmentsOrder> =
  new Schema<IInstallmentsOrder>(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      provider: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
      contract: {
        type: mongoose.Schema.Types.ObjectId,
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
              type: mongoose.Schema.Types.ObjectId,
            },
          },
        ],
        default: [],
      },
      address: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      dueDate: {
        type: Date,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

installmentsOrderSchema.index({ user: 1 });
installmentsOrderSchema.index({ provider: 1, status: 1, paymentStatus: 1 });

const InstallmentsOrder: Model<IInstallmentsOrder> =
  mongoose.model<IInstallmentsOrder>(
    "InstallmentsOrder",
    installmentsOrderSchema
  );

export default InstallmentsOrder;
