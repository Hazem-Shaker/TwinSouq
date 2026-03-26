import mongoose, { Model, Schema } from "mongoose";
import { IVariant } from "../types";

const variantSchema = new Schema<IVariant>({
  product: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  images: {
    type: [mongoose.Types.ObjectId],
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

const Variant: Model<IVariant> = mongoose.model("Variant", variantSchema);

export default Variant;
