import { z } from "zod";

const createProductValidation = z.object({
  name: z
    .string({
      error: "Product Name is required",
    })
    .min(3, "Product Name must be at least 3 characters")
    .max(50, "Product Name cannot exceed 50 characters"),
  price: z.coerce
    .number({
      error: "Price is required",
    })
    .max(99999999999999999, "Price is too high"),
  slug: z
    .string({
      error: "Slug is required",
    })
    .optional(),
  category: z.string({
    error: "Category is required ",
  }),
  tags: z.array(z.string()).optional().default([]),
});

const updateProductValidation = z.object({
  name: z
    .string({
      error: "Product Name is required",
    })
    .min(3, "Product Name must be at least 3 characters")
    .max(50, "Product Name cannot exceed 50 characters"),
  price: z.coerce
    .number({
      error: "Price is required",
    })
    .max(99999999999999999, "Price is too high"),
  slug: z
    .string({
      error: "Slug is required",
    })
    .optional(),
  category: z.string({
    error: "Category is required ",
  }),
  tags: z.array(z.string()).optional().default([]),
});

export { createProductValidation, updateProductValidation };
