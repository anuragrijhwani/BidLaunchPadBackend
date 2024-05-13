import z from "zod";

export const signupSchema = z.object({
  username: z.string({ required_error: "name is required" }).trim(),
  email: z.string({ required_error: "email is required" }).trim(),
  Phone: z
    .string({ required_error: "phone number is required" })
    .trim()
    .min(10, { message: "phone number at least 10 characters" }),
  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(6, { message: "password is at least 6 char long" })
    .max(25, { message: "password is max 25 char long" }),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "email is required" }).trim(),
  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(6, { message: "password is at least 6 char long" })
    .max(25, { message: "password is max 25 char long" }),
});

export const productSchema = z.object({
  productName: z.string({ required_error: "Product Name is required" }).trim(),
  productDesc: z
    .string({ required_error: "Product Description is required" })
    .trim(),
  productImages: z
    .string({ required_error: "Product Images are required" })
    .trim(),
  productPrice: z
    .string({ required_error: "Product Price is required" })
    .trim(),
  product_IncreasePrice: z
    .string({ required_error: "Product Increase Price is required" })
    .trim(),
    product_createDate:z
    .string({ required_error: "Product Create Date Price is required" })
    .trim(),
    product_CreatedBy:z
    .string({ required_error: "Product owner name Price is required" })
    .trim(),
});
