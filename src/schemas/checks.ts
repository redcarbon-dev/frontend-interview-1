import { z } from "zod";

export const IncidentCheckSchema = z.object({
  done: z.number().int().min(0),
  error: z.number().int().min(0),
  loading: z.number().int().min(0),
  pending: z.number().int().min(0),
  total: z.number().int().min(0),
  featureUnlicensed: z.number().int().min(0),
});

export const TagsSchema = z.array(z.string());

export const IncidentStatusSchema = z.union([
  z.literal("open"),
  z.literal("under_investigation"),
  z.literal("closed"),
]);
