import mongoose from "mongoose";
import { Input } from "./input";

type QueryType = Input["query"];

export const parseSearchQuery = (requestQuery: QueryType) => {
  const { item } = requestQuery;
  const matchQuery: any[] = [];

  if (item) {
    matchQuery.push({
      $match: {
        item: item,
      },
    });
  }
  return matchQuery;
};
