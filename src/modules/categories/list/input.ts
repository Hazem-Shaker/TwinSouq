import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const paginationSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  page: z.number(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export const querySchema = z.object({
  parent: z.string().optional(),
  name: z.string().optional(),
});

export type Query = z.infer<typeof querySchema>;
