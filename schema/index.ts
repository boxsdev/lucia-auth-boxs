import { z } from "zod"

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SignInSchemaType = z.infer<typeof SignInSchema>

export const SignUpSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
