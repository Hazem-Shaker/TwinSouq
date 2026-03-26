"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVarianstOfTheProduct = exports.getOptionsString = void 0;
const variant_model_1 = __importDefault(require("./variant.model"));
const getOptionsString = (options) => {
    const sortedOptions = options.sort((a, b) => a.key.localeCompare(b.key));
    // Create a unique string representation of the options array
    let optionsString = "";
    sortedOptions.forEach((option) => {
        // Use a delimiter that is unlikely to appear in keys or values
        optionsString += `${option.key}::${option.value}|`;
    });
    // Remove the trailing delimiter
    optionsString = optionsString.slice(0, -1);
    // Assign the string to the optionsString field
    return optionsString;
};
exports.getOptionsString = getOptionsString;
const createVarianstOfTheProduct = async (productId, options) => {
    const variants = [];
    let cur = [];
    function rec(i = 0) {
        if (i === options.length) {
            variants.push({
                product: productId,
                options: [...cur],
                optionsString: (0, exports.getOptionsString)(cur),
            });
            return;
        }
        for (let value of options[i].values) {
            cur.push({
                key: options[i].key,
                value,
            });
            rec(i + 1);
            if (cur.length)
                cur.pop();
        }
    }
    rec();
    await variant_model_1.default.insertMany(variants);
    return null;
};
exports.createVarianstOfTheProduct = createVarianstOfTheProduct;
