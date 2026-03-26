import mongoose from "mongoose";
import { Input } from "./input";

type QueryType = Input["query"];

export const parseSearchQuery = (
  requestQuery: QueryType,
  subCategories: mongoose.Types.ObjectId[]
) => {
  const { category, rating, minPrice, maxPrice, query, sale, installments } =
    requestQuery;
  const search: any = {
    index: "products",
    compound: {},
  };

  // Initialize must and filter arrays
  const must: any[] = [];
  const filter: any[] = [
    // Add archive filter to only show non-archived products
    {
      equals: {
        path: "archive",
        value: false,
      },
    },
  ];

  // Add query-based search
  if (query) {
    must.push({
      text: {
        query: query,
        path: ["name_ar", "name_en"],
        fuzzy: { maxEdits: 2 },
      },
    });
  }

  // Add category filter
  if (category) {
    filter.push({
      in: {
        path: "category",
        value: [category, ...subCategories],
      },
    });
  }
  if (installments) {
    filter.push({
      in: {
        path: "paymentChoices",
        value: installments === "true" ? ["both", "installements"] : ["cash"],
      },
    });
  }

  // Add rating filter
  if (rating) {
    filter.push({
      range: { path: "rating", gte: rating },
    });
  }

  //   Add price range filter
  filter.push({
    range: {
      path: "price",
      gte: minPrice ?? 0,
      lte: maxPrice ?? Number.MAX_VALUE,
    },
  });

  // Assign non-empty must and filter arrays
  if (must.length > 0) search.compound.must = must;
  if (filter.length > 0) search.compound.filter = filter;

  // **Ensure compound is never empty**
  if (!search.compound.must && !search.compound.filter) {
    search.compound.must = [{ exists: { path: "_id" } }]; // Dummy condition to avoid an empty compound
  }

  let matchQuery = [
    {
      $search: search,
    },
    ...(sale
      ? [
          {
            $match: {
              salePrice: sale === "true" ? { $ne: null } : { $eq: null },
            },
          },
        ]
      : []),
    {
      $project: {
        _id: 1,
        name_ar: 1,
        name_en: 1,
        price: 1,
        salePrice: 1,
        rating: 1,
        description_ar: 1,
        description_en: 1,
        images: 1,
      },
    },
  ];

  return matchQuery;
};
