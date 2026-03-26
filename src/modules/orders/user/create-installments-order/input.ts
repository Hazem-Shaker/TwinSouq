import { z } from "zod";
import {
  mongoIdSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema,
  product: mongoIdSchemaSpecialMessage("invalid_product_id"),
  variant: mongoIdSchemaSpecialMessage("invalid_variant_id"),
  address: mongoIdSchemaSpecialMessage("address_missing"),
  installmentOption: mongoIdSchemaSpecialMessage("invalid_installment_option"),
  accountStatement: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "account_statement_missing" }),
  salaryCertificate: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "salary_certificate_missing" }),
  contract: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "contract_missing" }),
  iban: z.any().refine((value) => {
    return value && typeof value === "string";
  }),
});

export type Input = z.infer<typeof inputSchema>;
