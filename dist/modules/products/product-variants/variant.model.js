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
const variantSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    images: {
        type: [mongoose_1.default.Types.ObjectId],
        default: [],
    },
    price: {
        type: Number,
        default: null,
    },
    salePrice: {
        type: Number,
        default: null,
    },
    stock: {
        type: Number,
        default: 0,
    },
    options: {
        type: [
            {
                key: {
                    type: String,
                },
                value: {
                    type: String,
                },
            },
        ],
    },
    optionsString: {
        type: String,
        required: true,
        index: true,
    },
});
// Middleware to convert options array to a string before saving
// variantSchema.pre("save", function (next) {
//   console.log("khaled");
//   if (this.isModified("options")) {
//     // Sort the options array to ensure consistent string representation
//     const sortedOptions = this.options.sort((a, b) =>
//       a.key.localeCompare(b.key)
//     );
//     // Create a unique string representation of the options array
//     let optionsString = "";
//     sortedOptions.forEach((option) => {
//       // Use a delimiter that is unlikely to appear in keys or values
//       optionsString += `${option.key}::${option.value}|`;
//     });
//     // Remove the trailing delimiter
//     optionsString = optionsString.slice(0, -1);
//     console.log("waleed");
//     // Assign the string to the optionsString field
//     this.optionsString = optionsString;
//   }
//   next();
// });
// Compound index on product and optionsString
variantSchema.index({ product: 1, optionsString: 1 }, { unique: true });
variantSchema.index({ product: 1, stock: 1 });
const Variant = mongoose_1.default.model("Variant", variantSchema);
exports.default = Variant;
