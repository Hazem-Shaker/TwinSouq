import Variant from "./variant.model";
import mongoose from "mongoose";
export const getOptionsString = (
  options: {
    key: string;
    value: string;
  }[]
) => {
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

export const createVarianstOfTheProduct = async (
  productId: mongoose.Types.ObjectId,
  options: { key: string; values: string[] }[]
) => {
  const variants: any = [];
  let cur: any = [];
  function rec(i = 0) {
    if (i === options.length) {
      variants.push({
        product: productId,
        options: [...cur],
        optionsString: getOptionsString(cur),
      });
      return;
    }

    for (let value of options[i].values) {
      cur.push({
        key: options[i].key,
        value,
      });
      rec(i + 1);
      if (cur.length) cur.pop();
    }
  }
  rec();
  await Variant.insertMany(variants);
  return null;
};
