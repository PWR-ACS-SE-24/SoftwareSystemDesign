import { z } from "@hono/zod-openapi";

export const FullNameSchema: z.ZodString = z.string().min(1).max(255);

export const EmailSchema: z.ZodString = z.string().email().max(255);

// TODO: what are our password requirements?
export const PasswordSchema: z.ZodString = z.string().min(8).max(64);

// TODO: what are our phone number constraints?
export const PhoneNumberSchema: z.ZodNullable<z.ZodString> = z.string().regex(/^[0-9+ ]{1,16}$/).nullable();
