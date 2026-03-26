import { z } from "zod";
import {
  identityNumberSchema,
  legalAgeScema,
  mongoIdSchema,
} from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema.refine((value) => value, {
    message: "provider_id_missing",
  }),
  iban: z
    .any()
    .refine((val) => val, {
      message: "iban_missing",
    })
    .refine((val) => typeof val === "string", {
      message: "iban_wrong_type",
    }),
  address: z
    .any()
    .refine((val) => val, {
      message: "address_missing",
    })
    .refine((val) => typeof val === "string", {
      message: "address_wrong_type",
    }),
  idNumber: identityNumberSchema,
  birthdate: legalAgeScema,
  gender: z
    .any()
    .refine((val) => val, {
      message: "gender_missing",
    })
    .refine(
      (val) => typeof val === "string" && ["male", "female"].includes(val),
      {
        message: "gender_wrong_value",
      }
    ),
  photo: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "photo_missing" }), // Restrict array length to 1,
  idImageFront: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "id_front_missing" }), // Restrict array length to 1
  idImageBack: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "id_back_missing" }), // Restrict array length to 1
});

export type Input = z.infer<typeof inputSchema>;

export const querySchema = z.object({
  filter: z.optional(z.string()),
});

export type Query = z.infer<typeof querySchema>;

export const paginationSchema = z.object({
  skip: z.number().int().gte(0),
  limit: z.number().int().positive(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export const acceptProviderRequestInputSchema = z.object({
  providerRequestId: mongoIdSchema,
});

export type AcceptProviderRequestInput = z.infer<
  typeof acceptProviderRequestInputSchema
>;

export const rejectProviderRequestInputSchema = z.object({
  providerRequestId: mongoIdSchema,
});

export type RejectProviderRequestInput = z.infer<
  typeof rejectProviderRequestInputSchema
>;

export const getProviderRequestInputSchema = z.object({
  providerRequestId: mongoIdSchema,
});

export type GetProviderRequestInput = z.infer<
  typeof getProviderRequestInputSchema
>;
