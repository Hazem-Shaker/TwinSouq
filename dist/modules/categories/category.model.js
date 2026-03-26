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
const slugify_1 = require("../../shared/utils/slugify");
const CategorySchema = new mongoose_1.Schema({
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
        default: "",
    },
    description_en: {
        type: String,
        default: "",
    },
    profitPercentage: {
        type: Number,
        default: 0,
    },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    image: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "File",
    },
    slug_ar: {
        type: String,
        unique: true,
    },
    slug_en: {
        type: String,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Middleware to auto-generate a slug before saving
CategorySchema.pre("save", function (next) {
    if (this.isModified("name_ar")) {
        this.slug_ar = (0, slugify_1.slugify)(this.name_ar);
    }
    if (this.isModified("name_en")) {
        this.slug_en = (0, slugify_1.slugify)(this.name_en);
    }
    next();
});
CategorySchema.index({ slug_en: 1 });
CategorySchema.index({ slug_ar: 1 });
// Mongoose Model
const Category = mongoose_1.default.model("Category", CategorySchema);
exports.default = Category;
