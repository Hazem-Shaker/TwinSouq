import { z } from "zod";
import {
  mongoIdSchema,
  stringSchema,
} from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  title: stringSchema("title"),
  owner: mongoIdSchema,
  name: stringSchema("name"),
  country: stringSchema("country"),
  city: stringSchema("city"),
  streetAddress: stringSchema("streetAddress"),
  zipCode: stringSchema("zipCode"),
});

export type Input = z.infer<typeof inputSchema>;
