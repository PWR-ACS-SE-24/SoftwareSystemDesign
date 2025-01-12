import { z } from "@hono/zod-openapi";

export const FullNameSchema: z.ZodString = z.string().min(1).max(255);

export const EmailSchema: z.ZodString = z.string().email().max(255);

// NOTE: at least one uppercase, at least one lowercase, at least 8 characters, at most 100 characters
export const PasswordSchema: z.ZodString = z.string().regex(/^(?=.*[A-Z])(?=.*[a-z]).{8,100}$/);

// NOTE: optional country code preceded by '+', then exactly 9 digits
export const PhoneNumberSchema: z.ZodNullable<z.ZodString> = z.string().regex(/^(\+[0-9]{2})?[0-9]{9}$/).nullable();
