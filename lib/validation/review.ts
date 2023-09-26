import * as z from "zod";

export const ReviewValidation = z.object({
  rating: z.string(),
  comment: z.string().min(3).max(1000),

  propertyId: z.string(),
  authorId: z.string(),
});
