import * as z from "zod";

export const PropertyValidation = z.object({
  propertyTitle: z.string().min(3).nonempty(),
  status: z.string({
    required_error: "Please select rent or status.",
  }),
  type: z.string({
    required_error: "Please select property type.",
  }),
  price: z.string().nonempty(),
  area: z.string().nonempty(),
  bedroom: z.string({
    required_error: "Please select number of bedrooms.",
  }),
  bathroom: z.string({
    required_error: "Please select number of bedrooms.",
  }),

  profile_photo: z.array(z.string()),

  address: z.string().min(8).nonempty(),
  city: z.string().min(3).nonempty(),
  state: z.string().min(3).nonempty(),
  pinCode: z.string().min(3).nonempty(),

  description: z.string().min(10).nonempty(),
  age: z.string({
    required_error: "Please select Building age.",
  }),
  garage: z.string({
    required_error: "Please select number of cars parked in garage.",
  }),
  rooms: z.string({
    required_error: "Please select total number of rooms.",
  }),
  features: z.array(z.string()),
  ownerName: z.string().min(3).nonempty(),
  ownerEmail: z.string().min(3).nonempty(),
  ownerPhone: z.string().min(3),
  accountId: z.string(),
});

export const reviewValidation = z.object({
  review: z.string().nonempty().min(3),
});
